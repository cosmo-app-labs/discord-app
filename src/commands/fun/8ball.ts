import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Command } from '../../types/command';
import config from '../../lib/config';
import { answers } from '../../lib/json/8ball.json';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('🎱 Ask the magic 8-ball a question.')
        .addStringOption((option) =>
            option
                .setName('question')
                .setDescription('The question you want to ask the 8-ball.')
                .setRequired(true)
        ),
    category: 'Fun',
    async execute(interaction) {
        // Get the question from the user
        const question = interaction.options.getString('question', true);

        // Defer the reply to fetch the message
        await interaction.deferReply();

        // Get a random answer from the 8-ball responses
        const answer = answers[Math.floor(Math.random() * answers.length)];

        // Create an embed with the 8-ball response
        const embed = new EmbedBuilder()
            .setColor(config.colors.embed)
            .setTitle('🎱 Magic 8-ball')
            .addFields({ name: 'Question', value: question }, { name: 'Answer', value: answer });

        // Edit the original reply with the 8-ball response
        return await interaction.editReply({ embeds: [embed] });
    },
};

export default command;
