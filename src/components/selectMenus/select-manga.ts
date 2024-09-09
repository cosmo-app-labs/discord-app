import { ActionRowBuilder, bold, EmbedBuilder, StringSelectMenuBuilder } from 'discord.js';
import { SelectMenu } from '../../types/selectMenu';
import axios from 'axios';
import config from '../../lib/config';

const selectMenu: SelectMenu = {
    data: {
        name: 'select-manga',
    },
    async execute(interaction) {
        // Get the selected manga ID from the interaction
        const selectedMangaId = interaction.values[0];

        // Create the URL to fetch the manga data
        const url = `https://kitsu.io/api/edge/manga/${selectedMangaId}`;

        // Fetch the manga data from the API
        const response = await axios.get(url);

        // Get the manga data from the response
        const manga = response.data.data;

        // Get the manga attributes
        const {
            canonicalTitle,
            endDate,
            chapterCount,
            volumeCount,
            ageRating,
            averageRating,
            popularityRank,
            ratingRank,
            startDate,
            status,
            synopsis,
            posterImage,
            titles,
        } = manga.attributes;

        // Fetch the genres of the manga
        const fetchGenres = async () => {
            const genres = await axios.get(manga.relationships.genres.links.related);
            return (
                genres.data.data.map((genre: any) => genre.attributes.name).join(', ') ||
                'not available'
            );
        };

        // Create an embed with the manga details
        const embed = new EmbedBuilder()
            .setTitle(
                `${canonicalTitle || 'No English Title'} | ${titles.en_jp || 'No Japanese Title'}`
            )
            .setURL(`https://kitsu.io/manga/${selectedMangaId}`)
            .setThumbnail(posterImage?.original)
            .setDescription(synopsis || 'No synopsis available.')
            .setColor(config.colors.embed)
            .addFields(
                { name: '⌛ Status', value: `${status ?? '??'}`, inline: true },
                { name: '➡️ Genres', value: `${await fetchGenres()}` },
                {
                    name: '🗓️ Aired',
                    value: startDate
                        ? `from ${bold(startDate || '?')} to ${bold(endDate || '?')}`
                        : 'not aired',
                },
                {
                    name: '💽 No. of Chapters',
                    value: `${chapterCount || '??'}`,
                    inline: true,
                },
                {
                    name: '📚 No. of Volumes',
                    value: `${volumeCount || '??'}`,
                    inline: true,
                },
                {
                    name: '🌟 Average Rating',
                    value: averageRating ? `${bold(`${averageRating}/100`)}` : 'Not Rated',
                    inline: true,
                },
                {
                    name: '🧑‍🦱 Age Rating',
                    value: `${ageRating || '??'}`,
                    inline: true,
                },
                {
                    name: '📈 Popularity Rank',
                    value: popularityRank ? `${bold(`#${popularityRank}`)}` : '??',
                    inline: true,
                },
                {
                    name: '🏆 Rank',
                    value: ratingRank ? `${bold(`TOP ${ratingRank}`)}` : '??',
                    inline: true,
                }
            );

        // Update the select menu with the selected manga
        const selectMenuComponent = createSelectMenu(
            interaction.message.components[0].components[0].data,
            selectedMangaId
        );

        // Create an action row with the updated select menu
        const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            selectMenuComponent
        );

        // Update the interaction with the embed and action row
        return await interaction.update({ embeds: [embed], components: [row] });
    },
};

// Create a select menu with the current select menu data
const createSelectMenu = (currentSelectMenuData: any, selectedMangaId: string) => {
    // Get the custom ID, placeholder, and options from the current select menu data
    const { custom_id, placeholder, options } = currentSelectMenuData;

    // Create a new select menu with the current select menu data
    return new StringSelectMenuBuilder()
        .setCustomId(custom_id)
        .setPlaceholder(placeholder)
        .addOptions(
            options.map((option: any) => ({
                label: option.label,
                description: option.description,
                value: option.value,
                default: option.value === selectedMangaId,
            }))
        );
};

export default selectMenu;
