import path from 'path';
import { REST, RESTPostAPIApplicationCommandsJSONBody, Routes } from 'discord.js';
import Table from 'cli-table3';
import Client from '../extensions/custom-client';
import { loadFiles } from '../lib/fileLoader';
import { Command } from '../types/command';

async function loadCommands(client: Client): Promise<void> {
    // Create a new table instance
    const table = new Table({
        head: ['Command', 'Status'],
        colWidths: [30, 10],
        style: { head: ['cyan'], border: ['grey'] },
    });

    // Clear existing commands in the client
    client.commands.clear();

    // Load command files
    const commands: RESTPostAPIApplicationCommandsJSONBody[] = [];
    const files = await loadFiles('src/commands');

    for (const file of files) {
        try {
            const commandModule = await import(file);
            const command: Command = commandModule.default || commandModule;

            if (!command?.data?.name) {
                console.warn(
                    `WARNING: The command "${path.basename(file, path.extname(file))}" is missing required properties and will be skipped.`
                );
                table.push([path.basename(file, path.extname(file)), '🟥']);
                continue;
            }

            if (client.commands.has(command.data.name)) {
                console.warn(
                    `WARNING: A Duplicate command name "${command.data.name}" has been detected and will be skipped.`
                );
                table.push([command.data.name, '🟥']);
                continue;
            }

            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
            table.push([command.data.name, '🟩']);
        } catch (error) {
            console.error(`Error loading command at ${file}:`, error);
            table.push([path.basename(file, path.extname(file)), '🟥']);
        }
    }

    // Ensure the client id and bot token is available
    const CLIENT_ID: string | undefined = process.env.CLIENT_ID!;
    const DISCORD_BOT_TOKEN: string | undefined = process.env.DISCORD_BOT_TOKEN!;

    if (!CLIENT_ID || !DISCORD_BOT_TOKEN) {
        console.error('Error: CLIENT_ID and/or DISCORD_BOT_TOKEN are not set.');
        process.exit(1);
    }

    const rest = new REST({ version: '10' }).setToken(DISCORD_BOT_TOKEN);
    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(Routes.applicationCommands(CLIENT_ID), {
            body: commands,
        });
        console.log(table.toString());
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}

export { loadCommands };
