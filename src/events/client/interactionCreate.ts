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
        } else if (interaction.isAutocomplete()) {
            const { commands } = client;
            const { commandName } = interaction;

            const command: Command | undefined = commands.get(commandName);
            if (!command || !command.autocomplete) return;

            try {
                await command.autocomplete(interaction, client);
            } catch (error) {
                console.error(error);
            }
        } else if (interaction.isStringSelectMenu()) {
            const { selectMenus } = client;
            const { customId } = interaction;

            const selectMenu = selectMenus.get(customId);
            if (!selectMenu) {
                return await interaction.reply({
                    content: `The select menu with the custom ID ${customId} does not exist!`
                });
            }

            try {
                await selectMenu.execute(interaction, client);
            } catch (error) {
                console.error(error);
                if (interaction.deferred) {
                    return await interaction.editReply({
                        content: `There was an error while executing the select menu ${customId.toLowerCase()}!`
                    });
                } else {
                    return await interaction.reply({
                        content: `There was an error while executing the select menu ${customId.toLowerCase()}!`
                    });
                }
            }
        }
    },
};

export default interactionCreateEvent;