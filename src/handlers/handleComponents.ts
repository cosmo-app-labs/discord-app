import path from "path";
import { Collection } from "discord.js";
import { loadFiles } from "../lib/fileLoader";
import Client from "../extensions/custom-client";
import { SelectMenu } from "../types/selectMenu";

type ComponentType = SelectMenu;

async function loadComponents(client: Client) {
    const componentsTypes = ["selectMenus"];
    for (const componentsType of componentsTypes) {
        const files = await loadFiles(`src/components/${componentsType}`);

        for (const file of files) {
            const componentModule = await import(file);
            const component: ComponentType = componentModule.default || componentModule;
            if (!component?.data?.name) {
                console.warn(`WARNING: The component "${path.basename(file, path.extname(file))}" is missing required properties and will be skipped.`);
                continue;
            }

            // Access the corresponding collection in the client
            const componentCollection = client[componentsType as keyof Client] as Collection<string, ComponentType>;
            if (componentCollection.has(component.data.name)) {
                console.warn(`WARNING: A Duplicate component name "${component.data.name}" has been detected and will be skipped.`);
                continue;
            }

            componentCollection.set(component.data.name, component);
        }
    }
}

export { loadComponents };
