import { ClientEvents } from 'discord.js';

/**
 * Represents a Discord event handler.
 */
export interface Event {
    /**
     * The name of the event. This should match a valid event name from Discord.js.
     */
    name: keyof ClientEvents;

    /**
     * The function that will be executed when the event is triggered.
     * @param args - Arguments passed by the event, varies depending on the event.
     */
    execute: (...args: any[]) => Promise<any> | void;

    /**
     * Indicates if the event is related to Discord's REST API.
     */
    rest?: boolean;

    /**
     * Indicates if the event should be registered as a one-time listener.
     * If `true`, the event will only be triggered once.
     */
    once?: boolean;
}
