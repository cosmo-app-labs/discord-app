import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../types/command";

const command: Command = {
    data: new SlashCommandBuilder()
        .setName("coinflip")
        .setDescription("🪙 Flip a coin."),
    category: "Fun",
    async execute(interaction) {
        // Defer the reply to fetch the message
        await interaction.deferReply();

        // Simulate a coin flip
        const result = Math.random() < 0.5 ? 'Heads' : 'Tails';

        // Edit the original reply with the coin flip result
        return await interaction.editReply(`🪙 ${result} !`);
    },
};

export default command;