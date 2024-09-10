import path from 'path';
import { Collection } from 'discord.js';
import { loadFiles } from '../lib/fileLoader';
import Client from '../extensions/custom-client';
import { Button } from '../types/button';
import { SelectMenu } from '../types/selectMenu';

type ComponentType = Button | SelectMenu;

async function loadComponents(client: Client) {
    // Check if the environment is production
    const NODE_ENV: string | undefined = process.env.NODE_ENV;
    const isProd = NODE_ENV === 'production';

    const componentsTypes = ['buttons', 'selectMenus'];
    for (const componentsType of componentsTypes) {
         const directoryPath = `${isProd ? 'dist' : 'src'}/components/${componentsType}`;
        const files = await loadFiles(directoryPath);

        for (const file of files) {
            const componentModule = await import(file);
            const component: ComponentType = componentModule.default || componentModule;
            if (!component?.data?.name) {
                console.warn(
                    `WARNING: The component "${path.basename(file, path.extname(file))}" is missing required properties and will be skipped.`
                );
                continue;
            }

            // Access the corresponding collection in the client
            const componentCollection = client[componentsType as keyof Client] as Collection<
                string,
                ComponentType
            >;
            if (componentCollection.has(component.data.name)) {
                console.warn(
                    `WARNING: A Duplicate component name "${component.data.name}" has been detected and will be skipped.`
                );
                continue;
            }

            componentCollection.set(component.data.name, component);
        }
    }
}

export { loadComponents };
