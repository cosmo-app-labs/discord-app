// Function to convert hex color to decimal
const hexToDecimal = (hex: string): number => {
    return parseInt(hex.replace('#', ''), 16);
};

const config = {
    colors: {
        embed: hexToDecimal("#e4684c"),
    },
}

export default config;