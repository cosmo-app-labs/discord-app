import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Collection, ComponentType, EmbedBuilder, Guild, SlashCommandBuilder } from 'discord.js';
import { Command } from '../../types/command';
import Client from "../../extensions/custom-client";
import config from '../../lib/config';

const ITEMS_PER_PAGE = 10;

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('guilds')
        .setDescription('Get information about the guilds the bot is in.'),
    category: 'Developer',
    developerOnly: true,
    async execute(interaction, client) {
        // Defer the reply to fetch the message
        await interaction.deferReply({ ephemeral: true });

        // Get all the guilds the bot is in
        const guilds = client.guilds.cache;

        // Calculate the total number of pages
        const totalPages = Math.max(1, Math.ceil(guilds.size / ITEMS_PER_PAGE));

        let currentPage = 1;

        // Function to update the message with the current page
        const updateMessage = async (page: number) => {
            // Create an embed with the guild information for the current page
            const embed = createEmbed(client, guilds, page);

            // Create the buttons for pagination
            const buttons = createButtons(page, totalPages);
            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);

            // Edit the reply with the updated information
            return await interaction.editReply({ embeds: [embed], components: [row] });
        };

        // Send the initial message
        const message = await updateMessage(currentPage);

        // Filter for the message component collector to only collect button interactions from the user
        const filter = (i: any) => i.customId.startsWith('guilds') && i.user.id === interaction.user.id;

        // Create a message component collector to listen for button interactions
        const collector = message.createMessageComponentCollector({
            filter,
            componentType: ComponentType.Button,
            time: 60000, // Collector time in milliseconds (60 seconds)
        });

        collector.on('collect', async (i) => {
            await i.deferUpdate();

            switch (i.customId) {
                case 'guilds-first':
                    currentPage = 1;
                    break;
                case 'guilds-previous':
                    currentPage = Math.max(currentPage - 1, 1);
                    break;
                case 'guilds-next':
                    currentPage = Math.min(currentPage + 1, totalPages);
                    break;
                case 'guilds-last':
                    currentPage = totalPages;
                    break;
            }

            // Update the message with the new page
            await updateMessage(currentPage);
        });

        collector.on('end', async () => {
            // Disable the buttons after the collector ends
            const buttons = createButtons(currentPage, totalPages, true);
            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);
            return await interaction.editReply({ components: [row] });
        });
    },
};

// Function to create an embed with the guild information for the current page
const createEmbed = (client: Client, guilds: Collection<string, Guild>, page: number) => {
    const totalGuilds = guilds.size;
    const totalUsers = guilds.reduce((acc, guild) => acc + guild.memberCount, 0);
    const totalPages = Math.ceil(totalGuilds / ITEMS_PER_PAGE);

    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;

    // Get the guilds sorted by member count
    const currentGuilds = totalGuilds === 0
        ? "No guilds available."
        : [...guilds.values()]
            .sort((a, b) => b.memberCount - a.memberCount)
            .slice(start, end)
            .map((guild: any, index: number) => {
                return `**${start + index + 1}.** ${guild.iconURL() ? `[${guild.name}](${guild.iconURL()})` : guild.name} - ${guild.memberCount.toLocaleString()} members`;
            })
            .join("\n");

    // Create the embed with the guild information
    return new EmbedBuilder()
        .setTitle('Guilds')
        .setColor(config.colors.embed)
        .setDescription(`Total Guilds: ${totalGuilds}\nTotal Users: ${totalUsers}\n\n${currentGuilds}`)
        .setFooter({ text: `Page ${page} of ${totalPages}`, iconURL: client.user?.displayAvatarURL() });
}

// Function to create the buttons for pagination
const createButtons = (page: number, totalPages: number, disable: boolean = false) => {
    return [
        new ButtonBuilder()
            .setCustomId('guilds-first')
            .setEmoji('⏮️')
            .setLabel('First')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(page === 1 || disable),
        new ButtonBuilder()
            .setCustomId('guilds-previous')
            .setEmoji('⬅️')
            .setLabel('Previous')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(page === 1 || disable),
        new ButtonBuilder()
            .setCustomId('guilds-next')
            .setEmoji('➡️')
            .setLabel('Next')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(page === totalPages || disable),
        new ButtonBuilder()
            .setCustomId('guilds-last')
            .setEmoji('⏭️')
            .setLabel('Last')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(page === totalPages || disable),
    ];
}

export default command;
