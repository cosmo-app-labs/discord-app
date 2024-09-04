import { Client, Collection } from "discord.js";
import { Event } from "../types/event";

// Extend the Client class of discord to add custom properties or methods
class CustomClient extends Client {
    events: Collection<string, Event> = new Collection();
}

export default CustomClient;