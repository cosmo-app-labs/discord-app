import { ButtonInteraction, CacheType, InteractionResponse } from 'discord.js';
import Client from '../extensions/custom-client';

/**
 * Interface representing a button component in a Discord app.
 * Defines the structure and behavior of button interactions within the app.
 */
export interface Button {
    /**
     * The builder object that defines the structure and behavior of the button.
     */
    data: {
        /**
         * The unique identifier for the button, used to handle interactions.
         */
        name: string;
    };

    /**
     * Handles the button interaction and performs the associated actions.
     * @param interaction - The interaction object representing the button click event.
     * @param client - The client instance of the Discord bot.
     * @returns A promise that resolves with the interaction response when the execution is complete.
     */
    execute(
        interaction: ButtonInteraction<CacheType>,
        client: Client
    ): Promise<InteractionResponse<boolean> | void>;
}
