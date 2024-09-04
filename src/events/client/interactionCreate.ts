import {
    Events,
    Interaction,
} from 'discord.js';
import Client from '../../extensions/custom-client';
import { Command } from '../../types/command';
import { Event } from '../../types/event';

const interactionCreateEvent: Event = {
    name: Events.InteractionCreate,
    async execute(interaction: Interaction, client: Client) {
        const isChatInputCommand = interaction.isChatInputCommand();
        if (isChatInputCommand) {
            const { commands } = client;
            const { commandName } = interaction;

            const command: Command | undefined = commands.get(commandName);
            if (!command) return;

            try {
                await command.execute(interaction, client);
            } catch (error) {
                console.error(error);
                await interaction.reply({
                    content: `Something went wrong while executing this command...`,
                    ephemeral: true,
                });
            }
        }
    },
};

export default interactionCreateEvent;