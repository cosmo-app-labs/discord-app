import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Command } from '../../types/command';
import axios from 'axios';
import config from '../../lib/config';

// Categories of actions
const categories = ["awoo", "bite", "blush", "bonk", "cuddle", "cry", "dance", "glomp", "handhold", "happy", "highfive", "hug", "kick", "kiss", "lick", "nom", "pat", "poke", "slap", "smile", "smug", "wave", "wink", "yeet"];

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('action')
        .setDescription('Get a random action image')
        .addStringOption(option =>
            option
                .setName('category')
                .setDescription('The category of the action')
                .setRequired(false)
                .setAutocomplete(true)
        ),
    category: 'Fun',
    async execute(interaction) {
        // Defer the reply to fetch the message
        await interaction.deferReply();

        // Get the category of the action
        const category = interaction.options.getString('category') || categories[Math.floor(Math.random() * categories.length)];

        // Fetch the action image
        const response = await axios.get(`https://api.waifu.pics/sfw/${category}`);

        // Create an embed
        const embed = new EmbedBuilder()
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
            .setColor(config.colors.embed)
            .setImage(response.data.url)
            .setFooter({ text: `Powered by waifu.pics` });

        // Reply with the embed
        return await interaction.editReply({ embeds: [embed] });
    },
    async autocomplete(interaction) {
        // Get the focused value (what the user has typed so far)
        const focusedValue = interaction.options.getFocused();
        const filtered = categories.filter(category => category.toLowerCase().startsWith(focusedValue.toLowerCase())).slice(0, 25);

        // Respond with the matching categories
        await interaction.respond(filtered.map(category => ({ name: category, value: category })));
    }
};

export default command;
