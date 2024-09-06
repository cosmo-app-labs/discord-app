import { ActionRowBuilder, bold, EmbedBuilder, hyperlink, inlineCode, StringSelectMenuBuilder } from "discord.js";
import config from "../../lib/config";
import { Category, Command } from "../../types/command";
import { SelectMenu } from "../../types/selectMenu";
import { createHelpEmbed, createSelectMenu } from "../../commands/information/help";

const selectMenu: SelectMenu = {
    data: {
        name: "help-category-select",
    },
    async execute(interaction, client) {
        const category: Category | "Main Menu" = interaction.values[0] as Category | "Main Menu";

        // Create a select menu with the categories
        const categoryMenu = createSelectMenu(category);

        // Create an action row with the select menu
        const row = new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(categoryMenu);

        if (category === "Main Menu") {
            // Use the imported createHelpEmbed function to generate the embed
            const embed = createHelpEmbed(client);

            // Reply with the updated embed
            return await interaction.update({ embeds: [embed], components: [row] });
        }

        // Filter commands by the selected category
        const filteredCommands = client.commands.filter((command: Command) => command.category === category);

        // Create an embed with the filtered commands
        const embed = new EmbedBuilder()
            .setAuthor({ name: `${interaction.client.user?.username}`, iconURL: interaction.client.user?.displayAvatarURL() })
            .setColor(config.colors.embed)
            .setTitle(`Viewing ${category} Category`)
            .setDescription(filteredCommands.size > 0 ?
                filteredCommands.map(cmd => `${bold(`/${cmd.data.name}`)}\n${cmd.data.description}`).join('\n\n') :
                `No commands found in the ${category} category.`
            );

        // Reply with the updated embed
        return await interaction.update({ embeds: [embed], components: [row] });
    },
};

export default selectMenu;
