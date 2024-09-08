import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../types/command";
import killMessages from "../../lib/json/kill.json";

const command: Command = {
    data: new SlashCommandBuilder()
        .setName("kill")
        .setDescription("🗡 Make a dramatic killing statement!")
        .addUserOption((option) =>
            option
                .setName("target")
                .setDescription("The user you want to kill")
                .setRequired(true)
        ),
    category: "Fun",
    async execute(interaction) {
        // Get the target user
        const target = interaction.options.getUser("target", true);

        // Defer the reply to fetch the message
        await interaction.deferReply();

        // Select a random kill message
        let randomKillMessage = killMessages[Math.floor(Math.random() * killMessages.length)];

        // Replace the placeholders in the kill message
        const formattedMessage = randomKillMessage
            .replace(/\${target}/g, `<@${target.id}>`)
            .replace(/\${perp}/g, `<@${interaction.user.id}>`);

        // Edit the original reply with the kill message
        return await interaction.editReply({
            content: `🗡 | ${formattedMessage}`,
            allowedMentions: { repliedUser: false },
        });
    },
};

export default command;