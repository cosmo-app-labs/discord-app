import { bold, inlineCode, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import ms from "ms";
import { Command } from "../../types/command";

const command: Command = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Pong! 🏓")
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
    category: "Utility",
    async execute(interaction) {
        // Defer the reply to fetch the message
        const initialReply = await interaction.deferReply({
            fetchReply: true,
        });

        // Calculate the response time
        const responseTime = ms(initialReply.createdTimestamp - interaction.createdTimestamp);
        const replyMessage = `🏓 ${bold('Pong! ')}${inlineCode(responseTime)}`;

        // Edit the deferred reply with the response time
        return await interaction.editReply({
            content: replyMessage,
        });
    },
};

export default command;