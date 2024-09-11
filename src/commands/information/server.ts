import { AttachmentBuilder, ChannelType, EmbedBuilder, SlashCommandBuilder, time, TimestampStyles } from 'discord.js';
import { Command } from '../../types/command';
import config from '../../lib/config';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Get information about the server!')
        .addSubcommand((subcommand) =>
            subcommand
                .setName("info")
                .setDescription("Get information about the server.")
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("icon")
                .setDescription("Display the server icon.")
        ),
    category: 'Information',
    async execute(interaction) {
        // Get the subcommand from the user
        const subcommand = interaction.options.getSubcommand();

        // Get the guild object from the interaction
        const { guild } = interaction;

        // Check if the command is used in a server
        if (!guild) {
            return await interaction.reply("❌ | This command can only be used in a server!");
        }

        // Switch the subcommand to execute the required action
        switch (subcommand) {
            case "info": {
                // Destructure the guild object to get the required information
                const { createdTimestamp, ownerId, description, members, memberCount, channels, emojis, stickers } = guild || {};

                // Function to get the size of the channels based on the type
                const getChannelTypeSize = (type: any) => channels.cache.filter((channel) => type.includes(channel.type)).size;

                // Create an embed with the server information
                const embed = new EmbedBuilder()
                    .setColor(config.colors.embed)
                    .setAuthor({
                        name: guild.name,
                        iconURL: guild.iconURL() ?? undefined,
                    })
                    .setThumbnail(guild.iconURL())
                    .addFields(
                        {
                            name: "GENERAL",
                            value: `Name: ${guild.name}\nCreated: ${time(Math.floor(createdTimestamp / 1000), TimestampStyles.RelativeTime)}\nOwner : <@${ownerId}>\nDescription: ${description}`,
                        },
                        {
                            name: "💡 | USERS",
                            value: `- Members: ${members.cache.filter((m) => m.user.bot === false).size
                                }\n- Bots: ${members.cache.filter((m) => m.user.bot === true).size
                                }\nTotal: ${memberCount}`,
                            inline: true,
                        },
                        {
                            name: "📺 | CHANNELS",
                            value: `- Text: ${getChannelTypeSize([
                                ChannelType.GuildText,
                                ChannelType.GuildAnnouncement,
                            ])}\n- Voice: ${getChannelTypeSize([
                                ChannelType.GuildVoice,
                                ChannelType.GuildStageVoice,
                            ])}\n- Threads: ${getChannelTypeSize([
                                ChannelType.PublicThread,
                                ChannelType.PrivateThread,
                                ChannelType.AnnouncementThread,
                            ])}\n- Categories: ${getChannelTypeSize([
                                ChannelType.GuildCategory,
                            ])}\n- Stages: ${getChannelTypeSize([
                                ChannelType.GuildStageVoice,
                            ])}\n- News: ${getChannelTypeSize([
                                ChannelType.GuildAnnouncement,
                            ])}\nTotal: ${channels.cache.size}`,
                            inline: true,
                        },
                        {
                            name: "😄 | EMOJIS & STICKERS",
                            value: `- Animated: ${emojis.cache.filter((e) => e.animated).size
                                }\n- Static: ${emojis.cache.filter((e) => !e.animated).size
                                }\n- Stickers: ${stickers.cache.size
                                }\nTotal: ${stickers.cache.size + emojis.cache.size
                                }`,
                            inline: true,
                        },
                        {
                            name: "✨ | NITRO & STATISTICS",
                            value: `- Roles: ${guild.roles.cache.size
                                }\n- Tier: ${guild.premiumTier
                                }\n- Boosts: ${guild.premiumSubscriptionCount
                                }\n- Boosters: ${members.cache.filter((m) => m.premiumSince).size
                                }`,
                            inline: true,
                        }
                    )
                    .setFooter({ text: "Last Updated" })
                    .setTimestamp();

                // Reply with the server information
                return await interaction.reply({ embeds: [embed] });
            }

            case "icon": {
                // Get the server icon URL
                const iconURL = guild.iconURL({ size: 2048 });

                // Check if the server has an icon
                if (!iconURL) {
                    return await interaction.reply("❌ | This server does not have an icon.");
                }

                // Create an attachment from the icon URL
                const attachment = new AttachmentBuilder(iconURL, {
                    name: 'server-icon.png',
                });

                // Reply with the server icon
                return await interaction.reply({ files: [attachment] });
            }
        }
    },
};

export default command;
