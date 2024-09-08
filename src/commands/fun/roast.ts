import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../types/command";
import roastMessages from "../../lib/json/roast.json";

const command: Command = {
    data: new SlashCommandBuilder()
        .setName("roast")
        .setDescription("😅 Roast someone with a witty message!")
        .addUserOption((option) =>
            option
                .setName("target")
                .setDescription("The user you want to roast")
                .setRequired(false)
        ),
    category: "Fun",
    async execute(interaction) {
        // Get the target user
        const user = interaction.options.getUser("target") || interaction.user;

        // Defer the reply to fetch the message
        await interaction.deferReply();

        // Select a random roast message
        const roastMessage = roastMessages[Math.floor(roastMessages.length * Math.random())];

        // Edit the original reply with the roast message
        return await interaction.editReply({
            content: `<@${user.id}>, ${roastMessage}`,
            allowedMentions: { repliedUser: false },
        });
    },
};

export default command;