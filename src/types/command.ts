import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    InteractionResponse,
    Message,
    SlashCommandBuilder,
    SlashCommandOptionsOnlyBuilder,
    SlashCommandSubcommandsOnlyBuilder,
} from 'discord.js';
import Client from '../extensions/custom-client';

/**
 * Represents the categories a command can belong to.
 */
export type Category = 'Fun' | 'Images' | 'Information' | 'Utility';

/**
 * Interface for defining a command in the Discord bot.
 */
export interface Command {
    /**
     * The builder object that defines the command's structure.
     */
    data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder;

    /**
     * The category to which the command belongs.
     * This helps in organizing commands into logical groups.
     */
    category: Category;

    /**
     * The function to be executed when the command is invoked.
     * It handles the command's logic and interacts with the Discord API.
     * @param interaction - The interaction object representing the command interaction.
     * @param client - The client instance of the Discord bot.
     */
    execute(
        interaction: ChatInputCommandInteraction,
        client: Client
    ): Promise<InteractionResponse<boolean> | Message<boolean> | undefined | void>;

    /**
     * Optional method to handle autocomplete interactions for the command.
     * @param interaction - The autocomplete interaction object.
     */
    autocomplete?(interaction: AutocompleteInteraction, client: Client): Promise<void>;
}
