import {
    ActionRowBuilder,
    EmbedBuilder,
    hyperlink,
    inlineCode,
    SlashCommandBuilder,
    StringSelectMenuBuilder,
} from 'discord.js';
import { Category, Command } from '../../types/command';
import Client from '../../extensions/custom-client';
import config from '../../lib/config';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get a list of all available commands!')
        .addStringOption((option) =>
            option
                .setName('command')
                .setDescription('The command you want help with')
                .setRequired(false)
                .setAutocomplete(true)
        ),
    category: 'Information',
    async execute(interaction, client) {
        // Get the command name from the user
        const commandName = interaction.options.getString('command');

        // If the user provided a command name
        if (commandName) {
            const command = client.commands.find((command) => command.data.name === commandName);
            if (!command) {
                return await interaction.reply({
                    content: `❌ | No command found with the name "${commandName}"`,
                });
            }

            // Create an embed with the command details
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: `${client.user?.username}`,
                    iconURL: client.user?.displayAvatarURL(),
                })
                .setColor(config.colors.embed)
                .setTitle(`Viewing ${command.data.name} Command`)
                .setDescription(command.data.description)
                .addFields({ name: 'Category', value: command.category });

            return await interaction.reply({ embeds: [embed] });
        }

        // Use the imported createHelpEmbed function to generate the embed
        const embed = createHelpEmbed(client);

        // Create a select menu with the categories
        const categoryMenu = createSelectMenu('Main Menu');

        // Create an action row with the select menu
        const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(categoryMenu);

        // Reply with the embed and select menu
        return await interaction.reply({
            embeds: [embed],
            components: [row],
        });
    },

    // Autocomplete function for the command option
    async autocomplete(interaction, client) {
        const focusedValue = interaction.options.getFocused();
        const filteredCommands = client.commands.filter((command) =>
            command.data.name.includes(focusedValue.toLowerCase())
        );

        await interaction.respond(
            filteredCommands.map((command) => ({
                name: command.data.name,
                value: command.data.name,
            }))
        );
    },
};

export function createHelpEmbed(client: Client) {
    return new EmbedBuilder()
        .setColor(config.colors.embed)
        .setAuthor({
            name: `${client.user?.username}`,
            iconURL: client.user?.displayAvatarURL(),
        })
        .setDescription(
            `Welcome to ${client.user}'s help menu. Here you will find all available commands.`
        )
        .addFields(
            {
                name: 'Commands',
                value: `> You can find all basic commands through the select menu below.\n> For more info on a specific command, use ${inlineCode('/help command:')}.`,
            },
            {
                name: 'Useful Links',
                value: `${hyperlink('Add to server', config.links.addToServer)} | ${hyperlink('Support Server', config.links.server)} | ${hyperlink('discordbotlist.com', config.links.dbl.default)} | ${hyperlink('top.gg', config.links.topgg.default)}`,
            }
        );
}

export function createSelectMenu(category: Category | 'Main Menu') {
    // Categories with descriptions
    const categories: { name: Category | 'Main Menu'; description: string }[] = [
        { name: 'Main Menu', description: 'Go back to the main menu' },
        {
            name: 'Fun',
            description: 'Commands for games and fun activities',
        },
        {
            name: 'Images',
            description: 'Commands for generating and fetching images',
        },
        {
            name: 'Information',
            description: 'Commands to retrieve useful information',
        },
        {
            name: 'Utility',
            description: 'Helpful utility commands for various tasks',
        },
    ];

    // Create a select menu with the categories
    return new StringSelectMenuBuilder()
        .setCustomId('help-category-select')
        .setPlaceholder(`${category}`)
        .addOptions(
            ...categories.map((cat) => ({
                label: cat.name,
                value: cat.name,
                description: cat.description,
                default: cat.name === category,
            }))
        );
}

export default command;
