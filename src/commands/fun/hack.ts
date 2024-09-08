import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../types/command";
import ms from "ms";

const command: Command = {
    data: new SlashCommandBuilder()
        .setName("hack")
        .setDescription("🐱‍💻 Pretend to hack someone for fun!")
        .addUserOption((option) =>
            option
                .setName("target")
                .setDescription("The user you want to hack")
                .setRequired(true)
        ),
    category: "Fun",
    async execute(interaction) {
        // Get the target user
        const targetUser = interaction.options.getUser("target", true);

        // Format the target user's username
        const formattedUsername = targetUser.username.toLowerCase().replace(/\s/g, "");

        // Defer the reply to fetch the message
        await interaction.deferReply();

        // Pretend to hack the user
        await interaction.editReply({
            content: `Hacking <@${targetUser.id}>....`,
            allowedMentions: { repliedUser: false },
        });

        // Hacking steps
        const hackingSteps = [
            "Finding Email and Password.....",
            "E-Mail: ${victim.username}@gmail.com \nPassword: ********",
            "Finding Other Accounts.....",
            "Setting up Epic Games Account.....",
            "Hacking Epic Games Account......",
            "Hacked Epic Games Account!!",
            "Collecting Info.....",
            "Selling data to FBI....",
        ];

        // Loop through the hacking steps
        for (let i = 0; i < hackingSteps.length; i++) {
            await new Promise((resolve) => setTimeout(resolve, ms(i === 0 ? "1s" : "6s")));
            await interaction.editReply({
                content: hackingSteps[i].replace("${victim.username}", `${formattedUsername}`),
                allowedMentions: { repliedUser: false },
            });
        }

        // Finish the hacking
        await new Promise((resolve) => setTimeout(resolve, ms("38s")));

        // Edit the previous reply with the finished message
        return await interaction.editReply({
            content: `Finished hacking <@${targetUser.id}>`,
            allowedMentions: { repliedUser: false },
        });
    },
};

export default command;