// Function to convert hex color to decimal
const hexToDecimal = (hex: string): number => {
    return parseInt(hex.replace('#', ''), 16);
};

const config = {
    colors: {
        embed: hexToDecimal('#e4684c'),
    },
    links: {
        addToServer:
            'https://discord.com/api/oauth2/authorize?client_id=894052180628234250&permissions=1644971945207&scope=bot%20applications.commands',
        server: 'https://discord.gg/q5dabUnkSb',
        topgg: {
            default: 'https://top.gg/bot/894052180628234250',
            vote: 'https://top.gg/bot/894052180628234250/vote',
        },
        dbl: {
            default: 'https://discordbotlist.com/bots/cosmo',
            vote: 'https://discordbotlist.com/bots/cosmo/upvote',
        },
    },
};

export default config;
