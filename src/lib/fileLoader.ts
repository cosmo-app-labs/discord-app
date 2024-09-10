import { promises as fs } from 'fs';
import path from 'path';

// Define a type for the function's return value
type FileList = string[];

/**
 * Recursively retrieves all .ts files from a given directory.
 * @param dir - The directory path to search for .ts files.
 * @returns A promise that resolves to a list of .ts file paths.
 */
async function getFiles(dir: string): Promise<FileList> {
    // Check if the environment is production
    const NODE_ENV: string | undefined = process.env.NODE_ENV;
    const isProd = NODE_ENV === 'production';

    let files: FileList = [];
    try {
        const items = await fs.readdir(dir, { withFileTypes: true });

        const filePromises = items.map(async (item) => {
            const fullPath = path.join(dir, item.name);
            const extension = isProd ? '.js' : '.ts';
            
            if (item.isDirectory()) {
                return getFiles(fullPath);
            } else if (item.isFile() && item.name.endsWith(extension)) {
                return [fullPath];
            }
            return [];
        });

        const results = await Promise.all(filePromises);
        files = results.flat();
    } catch (error) {
        console.error(`Error reading directory ${dir}:`, error);
    }

    return files;
}

/**
 * Loads all .ts files from a specified directory and clears the module cache.
 * @param dirName - The relative path to the directory from the current working directory.
 * @returns A promise that resolves to a list of .ts file paths.
 */
async function loadFiles(dirName: string): Promise<FileList> {
    const cwd = process.cwd();
    const patternDir = path.join(cwd, dirName);

    const files: FileList = await getFiles(patternDir);

    // Clear the module cache for each file
    files.forEach((file) => {
        delete require.cache[require.resolve(file)];
    });

    return files;
}

export { loadFiles };
