import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../types/command";
import axios from "axios";

const command: Command = {
    data: new SlashCommandBuilder()
        .setName("advice")
        .setDescription("Get a random piece of advice!")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("The user you want to give advice to")
                .setRequired(false)
        ),
    category: "Fun",
    async execute(interaction) {
        // Get the user to give advice to
        const user = interaction.options.getUser("user") || interaction.user;

        // Defer the reply to fetch the message
        await interaction.deferReply();

        // Fetch a random piece of advice
        const response = await axios.get("http://api.adviceslip.com/advice");
        const slip = response.data.slip;

        // Edit the original reply with the advice
        return await interaction.editReply({
            content: `${user}, ${slip.advice}`,
            allowedMentions: { repliedUser: false },
        });
    },
};

export default command;