import { ActionRowBuilder, SlashCommandBuilder, StringSelectMenuBuilder } from "discord.js";
import { Command } from "../../types/command";
import axios from "axios";

const command: Command = {
    data: new SlashCommandBuilder()
        .setName("anime")
        .setDescription("Get information about an anime!")
        .addStringOption((option) =>
            option
                .setName("search")
                .setDescription("Name of the anime to search")
                .setRequired(true)
        ),
    category: "Information",
    async execute(interaction) {
        // Get the search query from the user
        const searchQuery = interaction.options.getString("search", true);

        // Defer the reply to fetch the message
        await interaction.deferReply();

        // Create the URL to fetch the anime data
        const API_URL = `https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(searchQuery)}`;

        // Fetch the anime data from the API
        const response = await axios.get(API_URL);

        // Get the list of anime from the response
        const animeList = response.data.data;

        // If no anime is found, return an error message
        if (animeList.length === 0) {
            return await interaction.editReply({
                content: "❌ | No anime found with the provided search query.",
            });
        }

        // Get the top 5 anime from the list
        const topAnime = animeList
            .sort((a: any, b: any) => {
                const rankA = a.attributes.popularityRank || Number.MAX_SAFE_INTEGER;
                const rankB = b.attributes.popularityRank || Number.MAX_SAFE_INTEGER;
                return rankA - rankB;
            }).slice(0, 5);

        // Create a select menu with the top anime
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId("select-anime")
            .setPlaceholder("Select an anime")
            .addOptions(
                topAnime
                    .filter((anime: any) => anime.attributes.canonicalTitle || anime.attributes.titles.en_jp)
                    .map((anime: any) => ({
                        label: anime.attributes.canonicalTitle,
                        description: anime.attributes.titles.en_jp,
                        value: anime.id,
                    }))
            );

        // Create an action row with the select menu
        const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

        // Send a message to the user to select an anime
        return await interaction.editReply({
            content: "Select an anime from the list below:",
            components: [row],
        });
    }
};

export default command;