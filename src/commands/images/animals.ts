import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "../../types/command";
import axios from "axios";

const command: Command = {
    data: new SlashCommandBuilder()
        .setName("animals")
        .setDescription("Get animal images!")
        .addStringOption(option =>
            option
                .setName("type")
                .setDescription("Specify the type of animal you want to see")
                .setRequired(true)
                .addChoices(
                    { name: 'all', value: 'all' },
                    { name: 'cat', value: 'cats' },
                    { name: 'dog', value: 'dogs' },
                    { name: 'fox', value: 'foxes' },
                    { name: 'duck', value: 'duck' },
                    { name: 'red panda', value: 'redpandas' },
                    { name: 'horse', value: 'horses' },
                    { name: 'elephant', value: 'elephants' },
                    { name: 'ferret', value: 'ferrets' },
                )
        ),
    category: "Images",
    async execute(interaction) {
        // Get the type of animal from the user
        const type = interaction.options.getString("type", true);

        // Defer the reply to fetch the message
        await interaction.deferReply();

        const types = ['cats', 'dogs', 'foxes', 'duck', 'redpandas', 'horses', 'elephants', 'tiger', 'ferrets'];
        const randomType = types[Math.floor(Math.random() * types.length)];

        // Retry mechanism
        let attempts = 0;
        let success = false;
        let animal: any = null;

        // Try to fetch the animal image 10 times
        while (!success && attempts < 10) {
            attempts++;
            // Determine the API endpoint based on the type
            const endpoint = type === 'all'
                ? `https://www.reddit.com/r/${randomType}/random.json`
                : `https://www.reddit.com/r/${type}/random.json`;

            try {
                // Fetch data from the Reddit
                const response = await axios.get(endpoint);

                // Check if the response is valid
                if (response.status !== 200) {
                    continue; // Skip to the next attempt
                }

                // Get animal image data from the Reddit response
                const children = response.data[0]?.data?.children;

                // Check if valid data is returned
                if (!children || children.length === 0) {
                    return await interaction.editReply(`❌ | No valid animal image data found!`);
                }

                // Get the image with the highest upvotes
                animal = children
                    .map((child: any) => child.data)
                    .filter((animal: any) => animal.url && animal.url.startsWith('https://i.redd.it/'))
                    .sort((a: any, b: any) => b.ups - a.ups)[0];

                if (animal) {
                    success = true;
                }
            } catch (error) {
                console.error(error);
                continue; // Skip to the next attempt
            }
        }

        // If no valid animal image is found, return an error message
        if (!success || !animal) {
            return await interaction.editReply(`❌ | No valid animal images found, please try again.`);
        }

        // Extract information
        const { title, permalink, url: imageUrl } = animal;
        const redditUrl = `https://reddit.com${permalink}`;

        // Create and send the embed with the animal image data
        const embed = new EmbedBuilder()
            .setTitle(`${title}`)
            .setImage(imageUrl)
            .setURL(redditUrl)
            .setColor("Blue")

        // Edit the reply with the embed
        return await interaction.editReply({
            embeds: [embed],
        });
    },
};

export default command;