import { StringSelectMenuInteraction, CacheType, InteractionResponse } from 'discord.js';
import Client from '../extensions/custom-client';

/**
 * Interface representing a select menu component in a Discord app.
 * Defines the structure and behavior of select menu interactions within the app.
 */
export interface SelectMenu {
    /**
     * The builder object that defines the structure and behavior of the select menu.
     */
    data: {
        /**
         * The unique identifier for the select menu, used to handle interactions.
         */
        name: string;
    };

    /**
     * Handles the select menu interaction and performs the associated actions.
     * @param interaction - The interaction object representing the select menu event.
     * @param client - The client instance of the Discord bot.
     * @returns A promise that resolves with the interaction response when the execution is complete.
     */
    execute(interaction: StringSelectMenuInteraction<CacheType>, client: Client): Promise<InteractionResponse<boolean> | void>;
}