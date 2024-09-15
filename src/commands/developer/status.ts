import { ChannelType, EmbedBuilder, SlashCommandBuilder, time, TimestampStyles, UserFlags, User, version as djsVersion } from 'discord.js';
import { Command } from '../../types/command';
import ms from 'ms';
import os from 'os';
import config from '../../lib/config';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Get the bot status'),
    category: 'Developer',
    developerOnly: true,
    async execute(interaction, client) {
        // Fetch the user and application data
        await client.user?.fetch();
        await client.application?.fetch();

        // Function to get the size of the channels based on the type
        const getChannelTypeSize = (type: ChannelType[]) => client.channels.cache.filter((channel) => type.includes(channel.type)).size;

        // Create an embed with the bot status information
        const embed = new EmbedBuilder()
            .setColor(config.colors.embed)
            .setTitle(`🤖 ${client.user?.username} Status`)
            .setDescription(client.application?.description || null)
            .addFields(
                { name: "👩🏻‍🔧 Client", value: client.user?.tag ?? "", inline: true },
                {
                    name: "📆 Created",
                    value: `${time(Math.floor((client.user?.createdTimestamp || 0) / 1000), TimestampStyles.RelativeTime)}`,
                    inline: true,
                },
                {
                    name: "☑ Verified",
                    value: client.user?.flags?.has(UserFlags.VerifiedBot) ? "Yes" : "No",
                    inline: true,
                },
                {
                    name: "👩🏻‍💻 Owner",
                    value: `${client.application?.owner instanceof User ? client.application.owner.username : 'Team'}`,
                    inline: true,
                },
                {
                    name: "🖥 System",
                    value: os.type().replace("Windows_NT", "Windows").replace("Darwin", "macOS"),
                    inline: true,
                },
                { name: "🧠 CPU Model", value: `${os.cpus()[0].model}`, inline: true },
                {
                    name: "💾 Memory Usage",
                    value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(0)} MB`,
                    inline: true,
                },
                {
                    name: "⏰ Up Since",
                    value: `${time(Math.floor((client?.readyTimestamp || 0) / 1000), TimestampStyles.RelativeTime)}`,
                    inline: true,
                },
                { name: "⏳ Uptime", value: client?.uptime ? ms(client?.uptime) : "-", inline: true },
                { name: "👩🏻‍🔧 Node.js", value: process.version, inline: true },
                { name: "🛠 Discord.js", value: djsVersion, inline: true },
                { name: "🏓 Ping", value: `${client.ws.ping === -1 ? "-" : ms(client.ws.ping)}`, inline: true },
                { name: "🤹🏻‍♀️ Commands", value: `${client.commands.size}`, inline: true },
                { name: "🌍 Servers", value: `${client.guilds.cache.size}`, inline: true },
                {
                    name: "👨‍👩‍👧‍👦 Users",
                    value: `${client.guilds.cache.reduce((acc, guild) => acc + (guild.memberCount || 0), 0).toLocaleString()}`,
                    inline: true
                },
                {
                    name: "💬 Text Channels",
                    value: `${getChannelTypeSize([ChannelType.GuildText, ChannelType.GuildAnnouncement])}`,
                    inline: true,
                },
                {
                    name: "🎤 Voice Channels",
                    value: `${getChannelTypeSize([ChannelType.GuildVoice, ChannelType.GuildStageVoice])}`,
                    inline: true,
                },
                {
                    name: "🧵 Threads",
                    value: `${getChannelTypeSize([ChannelType.PublicThread, ChannelType.PrivateThread, ChannelType.AnnouncementThread])}`,
                    inline: true,
                }
            );

        // Reply to the user with the bot status
        return await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};

export default command;
