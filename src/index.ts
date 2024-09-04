import "dotenv/config"; // Load environment variables from .env file
import { GatewayIntentBits } from "discord.js";
import Client from "./extensions/custom-client";
import { loadEvents } from "./handlers/handleEvents";

// Ensure the bot token is available
const DISCORD_BOT_TOKEN: string | undefined = process.env.DISCORD_BOT_TOKEN;
if (!DISCORD_BOT_TOKEN) {
    console.error('Error: DISCORD_BOT_TOKEN is not set.');
    process.exit(1);
}

// Define intents for the bot
const intents: GatewayIntentBits[] = [
    GatewayIntentBits.Guilds,
];

// Create a new instance of the Client class
const client: Client = new Client({
    intents: intents,
});

// Load events into the client
loadEvents(client);

client.login(DISCORD_BOT_TOKEN);