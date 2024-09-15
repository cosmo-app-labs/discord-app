import Client from '../extensions/custom-client';
import { AutoPoster } from 'topgg-autoposter';

const TOP_GG_TOKEN = process.env.TOP_GG_TOKEN;

const setupTopggIntegration = async (client: Client) => {
    if (!TOP_GG_TOKEN) {
        throw new Error('Missing Top.gg API token.');
    }

    // Initialize AutoPoster with the API token and the client
    const autoPoster = AutoPoster(TOP_GG_TOKEN, client);

    // Log when the stats are posted successfully
    autoPoster.on('posted', () => {
        console.log('Successfully posted bot stats to Top.gg!');
    });

    // Log errors, if any
    autoPoster.on('error', (error) => {
        console.error('Error posting bot stats to Top.gg:', error);
    });
}

export default setupTopggIntegration;