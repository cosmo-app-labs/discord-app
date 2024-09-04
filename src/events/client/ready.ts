import { Client, ActivityType, Events } from "discord.js";
import { Event } from "../../types/event";

const clientReadyEvent: Event = {
    name: Events.ClientReady,
    once: true,
    async execute(client: Client) {
        // Count total number of users across all guilds
        const userCount = client.guilds.cache.reduce((acc, guild) => acc + (guild.memberCount || 0), 0);

        // Format the user count with commas for thousands
        const formattedUserCount = userCount.toLocaleString();

        // Singular or plural form for "user"
        const userText = userCount === 1 ? "user" : "users";

        // Set the presence to show the user count
        client.user?.setPresence({
            activities: [{ type: ActivityType.Listening, name: `${formattedUserCount} ${userText}` }],
            status: "online",
        });
        
        console.log(`${client.user?.tag} is logged in and online.`);
    },
};

export default clientReadyEvent;