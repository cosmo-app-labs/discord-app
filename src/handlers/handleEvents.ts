import path from 'path';
import Table from 'cli-table3';
import Client from '../extensions/custom-client';
import { loadFiles } from '../lib/fileLoader';
import { Event } from '../types/event';

/**
 * Loads and registers event handlers for a Discord client.
 * @param client - The Discord client instance.
 * @returns A promise that resolves when all events have been loaded and registered.
 */
async function loadEvents(client: Client): Promise<void> {
    // Check if the environment is production
    const NODE_ENV: string | undefined = process.env.NODE_ENV;
    const isProd = NODE_ENV === 'production';

    // Initialize a CLI table to display loaded events
    const table = new Table({
        head: ['Events', 'Status'],
        colWidths: [30, 10],
        style: { head: ['cyan'], border: ['grey'] },
    });

    // Clear any previously registered events
    client.events.clear();

     // Load event files from the specified directory
     const directoryPath = isProd ? 'dist/events' : 'src/events';
     const files = await loadFiles(directoryPath);

    const results = await Promise.allSettled(
        files.map(async (file: string) => {
            try {
                // Import the event module
                const eventModule = await import(file);
                const event: Event = eventModule.default || eventModule;

                // Define the execute function to pass the client as an argument
                const execute = (...args: any[]) => event.execute(...args, client);

                // Register the event in the client's events collection
                client.events.set(event.name, event);

                // Register the event with the client or its REST API depending on the event's configuration
                if (event.rest) {
                    if (event.once) {
                        client.rest.once(event.name, execute);
                    } else {
                        client.rest.on(event.name, execute);
                    }
                } else {
                    if (event.once) {
                        client.once(event.name, execute);
                    } else {
                        client.on(event.name, execute);
                    }
                }

                // Add event to the CLI table with a status indicator
                table.push([event.name, '🟩']);
            } catch (error) {
                console.error(`Error loading event file ${file}:`, error);
                table.push([path.basename(file, path.extname(file)), '🟥']);
            }
        })
    );

    const statuses = table.map((event: any) => event[1]);
    const successes = statuses.filter((status: string) => status === '🟩').length;
    const errors = statuses.filter((status: string) => status === '🟥').length;

    // Log the table with all processed events
    console.log(
        table.toString(),
        `\nEvents Processed: ${table.length}, (Successes: ${successes}, Errors: ${errors})`
    );
}

export { loadEvents };
