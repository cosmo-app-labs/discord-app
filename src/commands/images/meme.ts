import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "../../types/command";
import axios from "axios";

const command: Command = {
    data: new SlashCommandBuilder()
        .setName("meme")
        .setDescription("Get a meme!"),
    category: "Images",
    async execute(interaction) {
        // Defer the reply to fetch the message
        await interaction.deferReply();

        // Retry mechanism
        let attempts = 0;
        let success = false;
        let meme: any = null;

        // Try to fetch the meme 10 times
        while (!success && attempts < 10) {
            attempts++;
            // Define the API endpoint
            const endpoint = `https://www.reddit.com/r/memes/random.json`;
            try {
                // Fetch data from the Reddit
                const response = await axios.get(endpoint);

                // Check if the response is valid
                if (response.status !== 200) {
                    continue; // Skip to the next attempt
                }

                // Get meme data from the Reddit response
                const children = response.data[0]?.data?.children;

                // Check if valid data is returned
                if (!children || children.length === 0) {
                    return await interaction.editReply(`❌ | No valid meme data found!`);
                }

                // Get the meme with the highest upvotes
                meme = children
                    .map((child: any) => child.data)
                    .filter((meme: any) => meme.url && meme.url.startsWith('https://i.redd.it/'))
                    .sort((a: any, b: any) => b.ups - a.ups)[0];

                if (meme) {
                    success = true;
                }
            } catch (error) {
                console.log(error);
                continue; // Skip to the next attempt
            }
        }

        // If no valid meme is found, return an error message
        if (!success || !meme) {
            return await interaction.editReply(`❌ | No valid memes found, please try again.`);
        }

        // Extract meme information
        const { title, permalink, url: imageUrl } = meme;
        const redditUrl = `https://reddit.com${permalink}`;

        // Create and send the embed with the meme data
        const embed = new EmbedBuilder()
            .setTitle(`${title}`)
            .setImage(imageUrl)
            .setURL(redditUrl)
            .setColor("Blue");

        // Edit the reply with the embed
        return await interaction.editReply({
            embeds: [embed],
        });
    },
};

export default command;