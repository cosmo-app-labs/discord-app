import { bold, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "../../types/command";
import axios from "axios";
import ms from "ms";
import config from "../../lib/config";

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
        const search = interaction.options.getString("search", true);

        // Defer the reply to fetch the message
        await interaction.deferReply();

        // Create the URL to fetch the anime data
        const url = `https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(search)}`;

        // Fetch the anime data from the API
        const response = await axios.get(url);

        // Get the first anime from the response
        const anime = response.data.data[0];

        // If no anime was found
        if (!anime) {
            return await interaction.editReply({
                content: "❌ | No anime found with the provided search query.",
            });
        }

        // Get the anime attributes
        const { canonicalTitle, endDate, episodeCount, episodeLength, ageRating, averageRating, popularityRank, ratingRank, showType, startDate, status, synopsis, posterImage, titles } = anime.attributes;

        // Fetch the genres of the anime
        const fetchGenres = async () => {
            const genres = await axios.get(anime.relationships.genres.links.related);
            return genres.data.data.map((genre: any) => genre.attributes.name).join(", ") || "not available";
        };

        // Create an embed with the anime details
        const embed = new EmbedBuilder()
            .setTitle(`${canonicalTitle || "No english title"} | ${titles.en_jp || "No Japanese Title"}`)
            .setURL(`https://kitsu.io/anime/${anime.id}`)
            .setThumbnail(posterImage?.original)
            .setDescription(synopsis || 'No synopsis available.')
            .setColor(config.colors.embed)
            .addFields(
                { name: "⌛ Status", value: `${status ?? "??"}`, inline: true },
                { name: "🗂️ Type", value: `${showType || "??"}`, inline: true },
                { name: "➡️ Genres", value: `${await fetchGenres()}` },
                { name: "🗓️ Aired", value: startDate ? `from ${bold(startDate || "?")} to ${bold(endDate || "?")}` : "not aired" },
                { name: "💽 No. of Episodes", value: `${episodeCount || "??"}`, inline: true },
                {
                    name: "⏱️ Episode Length",
                    value: episodeLength ? ms(episodeLength * 60 * 1000, { long: true }) : "??",
                    inline: true,
                },
                {
                    name: "🌟 Average Rating",
                    value: averageRating ? `${bold(`${averageRating}/100`)}` : "Not Rated",
                    inline: true,
                },
                { name: "🧑‍🦱 Age Rating", value: `${ageRating || "??"}`, inline: true },
                { name: "📈 Popularity Rank", value: popularityRank ? `${bold(`#${popularityRank}`)}` : "??", inline: true },
                { name: "🏆 Rank", value: ratingRank ? `${bold(`TOP ${ratingRank}`)}` : "??", inline: true }
            );

        // Reply with the anime details
        return await interaction.editReply({ embeds: [embed] });
    }
};

export default command;