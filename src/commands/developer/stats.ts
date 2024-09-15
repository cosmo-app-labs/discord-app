import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../types/command';
import axios from 'axios';

const DBL_TOKEN = process.env.DBL_TOKEN;

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Update the bot stats on discordbotlist.com'),
    category: 'Developer',
    developerOnly: true,
    async execute(interaction, client) {
        // Defer the reply to fetch the message
        await interaction.deferReply({ ephemeral: true });

        try {
            // Update stats on DBL
            if (!DBL_TOKEN) {
                console.error('Error: Missing Discord Bot List API token.');
                return await interaction.editReply({ content: 'Error: Missing Discord Bot List API token.' });
            }

            // Construct the URL and payload for the request
            const url = `https://discordbotlist.com/api/v1/bots/${client.user?.id}/stats`;
            const payload = {
                guilds: client.guilds.cache.size,
                users: client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0),
            };

            // Make a POST request to update the bot stats
            await axios.post(url, payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: DBL_TOKEN,
                    },
                }
            );

            // Reply to the user with the success message
            return await interaction.editReply({ content: 'Successfully updated bot stats.' });

        } catch (error) {
            // Handle any errors from the API call
            console.error('Failed to update Discord Bot List stats:', error);
            return await interaction.editReply({ content: 'Failed to update bot stats.' });
        }
    },
};

export default command;
