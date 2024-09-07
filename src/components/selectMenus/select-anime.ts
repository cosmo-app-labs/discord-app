import { ActionRowBuilder, bold, EmbedBuilder, StringSelectMenuBuilder } from "discord.js";
import { SelectMenu } from "../../types/selectMenu";
import axios from "axios";
import ms from "ms";
import config from "../../lib/config";

const selectMenu: SelectMenu = {
    data: {
        name: "select-anime",
    },
    async execute(interaction, client) {
        // Get the selected anime ID from the interaction
        const selectedAnimeId = interaction.values[0];

        // Create the URL to fetch the anime data
        const url = `https://kitsu.io/api/edge/anime/${selectedAnimeId}`;

        // Fetch the anime data from the API
        const response = await axios.get(url);

        // Get the anime data from the response
        const anime = response.data.data;

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
            .setURL(`https://kitsu.io/anime/${selectedAnimeId}`)
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

        // Update the select menu with the selected anime
        const selectMenuComponent = createSelectMenu(interaction.message.components[0].components[0].data, selectedAnimeId);

        // Create an action row with the updated select menu
        const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenuComponent);

        // Update the interaction with the embed and action row
        return await interaction.update({ embeds: [embed], components: [row] });
    },
};

// Create a select menu with the current select menu data
const createSelectMenu = (currentSelectMenuData: any, selectedAnimeId: string) => {
    // Get the custom ID, placeholder, and options from the current select menu data
    const { custom_id, placeholder, options } = currentSelectMenuData;

    // Create a new select menu with the current select menu data
    return new StringSelectMenuBuilder()
        .setCustomId(custom_id)
        .setPlaceholder(placeholder)
        .addOptions(
            options.map((option: any) => (
                {
                    label: option.label,
                    description: option.description,
                    value: option.value,
                    default: option.value === selectedAnimeId,
                }
            ))
        );
}

export default selectMenu;
