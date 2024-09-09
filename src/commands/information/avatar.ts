import { AttachmentBuilder, SlashCommandBuilder } from 'discord.js';
import { Command } from '../../types/command';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Display the avatar of the provided user.')
        .addUserOption((option) =>
            option.setName('user').setDescription('User to get the avatar of')
        ),
    category: 'Information',
    async execute(interaction) {
        // Get the user to fetch the avatar of
        const user = interaction.options.getUser('user') || interaction.user;

        // Get the user's avatar URL
        const avatarUrl = user.displayAvatarURL({ size: 2048 });

        // Create an attachment from the avatar URL
        const attachment = new AttachmentBuilder(avatarUrl, {
            name: 'avatar.png',
        });

        // Reply with the user's avatar
        return await interaction.reply({
            content: `Here is ${user}'s avatar.`,
            files: [attachment],
            allowedMentions: { repliedUser: false },
        });
    },
};

export default command;
