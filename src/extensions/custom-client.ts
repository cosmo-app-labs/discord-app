import { Client, Collection } from "discord.js";
import { Command } from "../types/command";
import { Event } from "../types/event";
import { SelectMenu } from "../types/selectMenu";

// Extend the Client class of discord to add custom properties or methods
class CustomClient extends Client {
    commands: Collection<string, Command> = new Collection();
    events: Collection<string, Event> = new Collection();
    selectMenus: Collection<string, SelectMenu> = new Collection();
}

export default CustomClient;