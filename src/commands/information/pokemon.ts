import { bold, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Command } from '../../types/command';
import axios from 'axios';
import config from '../../lib/config';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('pokemon')
        .setDescription('Get information about a Pokémon!')
        .addStringOption((option) =>
            option
                .setName('name')
                .setDescription('Name of pokemon to search')
                .setRequired(true)
                .setMinLength(1)
                .setMaxLength(50)
        ),
    category: 'Information',
    async execute(interaction) {
        // Get the name of the Pokémon from the user
        const pokemonName = interaction.options.getString('name', true).toLowerCase();

        // Defer the reply to fetch the message
        await interaction.deferReply();

        // Fetch data from the Pokémon API
        const API_BASE_URL = 'https://pokeapi.co/api/v2/pokemon/';
        const response = await axios.get(`${API_BASE_URL}/${pokemonName}`);

        if (response.status !== 200) {
            return await interaction.reply(`❌ | No search results for ${bold(pokemonName)}`);
        }

        // Extract the required data from the response
        const pokemonData = response.data;
        const { name, id, sprites, base_experience, weight, height, types, stats, abilities } =
            pokemonData;

        const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

        const typeNames = types.map((type: { type: { name: string } }) =>
            capitalize(type.type.name)
        );
        const typeList = typeNames.join(', ');
        const typeLabel = typeNames.length > 1 ? 'Types' : 'Type';

        const abilityNames = abilities.map((ability: { ability: { name: string } }) =>
            capitalize(ability.ability.name)
        );
        const abilityList = abilityNames.join(', ');
        const abilityLabel = abilityNames.length > 1 ? 'Abilities' : 'Ability';

        // Create an embed with the Pokémon data
        const embed = new EmbedBuilder()
            .setColor(config.colors.embed)
            .setTitle(`${capitalize(name)} #${id}`)
            .setThumbnail(sprites.front_default)
            .addFields(
                {
                    name: 'Base Experience',
                    value: `${base_experience}`,
                    inline: true,
                },
                { name: 'Weight', value: `${weight}`, inline: true },
                { name: 'Height', value: `${height}`, inline: true },
                { name: typeLabel, value: typeList },
                {
                    name: abilityLabel,
                    value: `${abilityList}\n——————————\n${bold('Stats')}`,
                }
            );

        // Add the stats to the embed
        stats.forEach((stat: { stat: { name: string }; base_stat: number }) =>
            embed.addFields({
                name: capitalize(stat.stat.name),
                value: `${stat.base_stat}`,
                inline: true,
            })
        );

        // Edit the reply with the embed
        return await interaction.editReply({ embeds: [embed] });
    },
};

export default command;
