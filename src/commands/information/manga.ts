import { ActionRowBuilder, SlashCommandBuilder, StringSelectMenuBuilder } from 'discord.js';
import { Command } from '../../types/command';
import axios from 'axios';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('manga')
        .setDescription('Get information about a manga!')
        .addStringOption((option) =>
            option.setName('search').setDescription('Name of the manga to search').setRequired(true)
        ),
    category: 'Information',
    async execute(interaction) {
        // Get the search query from the user
        const searchQuery = interaction.options.getString('search', true);

        // Defer the reply to fetch the message
        await interaction.deferReply();

        // Create the URL to fetch the anime data
        const API_URL = `https://kitsu.io/api/edge/manga?filter[text]=${encodeURIComponent(searchQuery)}`;

        // Fetch the manga data from the API
        const response = await axios.get(API_URL);

        // Get the list of manga from the response
        const mangaList = response.data.data;

        // If no manga is found, return an error message
        if (mangaList.length === 0) {
            return await interaction.editReply({
                content: '❌ | No manga found with the provided search query.',
            });
        }

        // Get the top 5 manga from the list
        const topManga = mangaList
            .sort((a: any, b: any) => {
                const rankA = a.attributes.popularityRank || Number.MAX_SAFE_INTEGER;
                const rankB = b.attributes.popularityRank || Number.MAX_SAFE_INTEGER;
                return rankA - rankB;
            })
            .slice(0, 5);

        // Create a select menu with the top manga
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('select-manga')
            .setPlaceholder('Select a manga')
            .addOptions(
                topManga
                    .filter(
                        (manga: any) =>
                            manga.attributes.canonicalTitle || manga.attributes.titles.en_jp
                    )
                    .map((manga: any) => ({
                        label: manga.attributes.canonicalTitle,
                        description: manga.attributes.titles.en_jp,
                        value: manga.id,
                    }))
            );

        // Create an action row with the select menu
        const actionRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

        // Send a message to the user to select a manga
        return await interaction.editReply({
            content: 'Select a manga from the list below:',
            components: [actionRow],
        });
    },
};

export default command;
