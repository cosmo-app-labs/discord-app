import { bold, Colors, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Command } from '../../types/command';
import axios from 'axios';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('urban')
        .setDescription('Get definitions and explanations for terms on Urban Dictionary!')
        .addStringOption((option) =>
            option
                .setName('search')
                .setDescription('Term to search on Urban Dictionary')
                .setRequired(true)
                .setMinLength(1)
                .setMaxLength(50)
        ),
    category: 'Information',
    async execute(interaction) {
        // Get the search query from the user
        const query = interaction.options.getString('search', true);
        const search = encodeURIComponent(query);

        // Defer the reply to fetch the message
        await interaction.deferReply();

        try {
            // Fetch data from the Urban Dictionary API
            const response = await axios.get(
                `https://api.urbandictionary.com/v0/define?term=${search}`
            );
            const data = await response.data;

            if (!data?.list?.length) {
                return await interaction.editReply(`❌ | No results for ${bold(query)}`);
            }

            // Truncate the input to 1024 characters
            function trimText(input: string) {
                return input.length > 1024 ? `${input.slice(0, 1020)} ...` : input;
            }

            // Get the first definition from the list
            const definition = data.list[0];

            // Create an embed with the definition data
            const embed = new EmbedBuilder()
                .setColor(Colors.Blue)
                .setTitle(`Definition of ${definition.word}`)
                .setURL(definition.permalink)
                .setDescription(trimText(definition.definition))
                .setThumbnail('https://i.imgur.com/VFXr0ID.jpg')
                .addFields(
                    { name: 'Example', value: trimText(definition.example) },
                    {
                        name: '👍',
                        value: `${definition.thumbs_up}`,
                        inline: true,
                    },
                    {
                        name: '👎',
                        value: `${definition.thumbs_down}`,
                        inline: true,
                    }
                )
                .setFooter({ text: `Entry by ${definition.author}` });

            // Edit the reply with the embed
            return await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Failed to fetch data:', error);
            return await interaction.editReply('Failed to fetch data from Urban Dictionary API!');
        }
    },
};

export default command;
