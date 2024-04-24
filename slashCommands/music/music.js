const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits, VoiceChannel, GuildEmoji} = require('discord.js');
const client = require("../../index")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("music")
    .setDescription("music system")
    .addSubcommand(subcommand =>
        subcommand.setName("play")
        .setDescription("Play a song.")
        .addStringOption(option =>
            option.setName("query")
            .setDescription("Specify the name or URL of the song.")
            .setRequired(true)
        )
     )
     .addSubcommand(subcommand =>
        subcommand.setName("volume")
        .setDescription("Adjust the volume of the song.")
        .addNumberOption(option =>
            option.setName("percentage")
            .setDescription("Adjust volume in appropriate units: 10 = 10%")
            .setMinValue(1)
            .setMaxValue(100)
            .setRequired(true)
        )
     )
     .addSubcommand(subcommand =>
        subcommand.setName("stop")
        .setDescription("Stop the music.")
     )
     .addSubcommand(subcommand =>
        subcommand.setName("skip")
        .setDescription("Skip the current song.")
     )
     .addSubcommand(subcommand =>
        subcommand.setName("loop-all")
        .setDescription("Loop all songs in the queue.")
     )
     .addSubcommand(subcommand =>
        subcommand.setName("loop-queue")
        .setDescription("Loop the queue.")
     )
     .addSubcommand(subcommand =>
        subcommand.setName("autoplay")
        .setDescription("Toggle autoplay.")
     ),
     async execute({interaction, client}) {
        const {options, member, guild, channel} = interaction;

        const subcommand = options.getSubcommand();
        const query = options.getString("query");
        const volume = options.getNumber("percentage");
        const voiceChannel = member.voice.channel;

        const embed = new EmbedBuilder();

        if (!voiceChannel) {
            embed.setColor("#ff0000").setDescription("You must be on voice chat!");
            return interaction.reply({ embeds: [embed], ephemeral: true});
        }

        if (!member.voice.channelId == guild.members.me.voice.channelId) {
            embed.setColor("#ff0000").setDescription(`You cannot use the music system because it is already active in the: <#${guild.members.me.voice.channelId}>`);
            return interaction.reply({ embeds: [embed], ephemeral: true});
        }

        try {
            const queue = client.distube.getQueue(voiceChannel);

            switch (subcommand) {
                case "play":
                    client.distube.play(voiceChannel, query, {textChannel: channel, member: member});
                    return interaction.reply ({ content: "🎶 Request received."});
                case "volume":
                    client.distube.setVolume(voiceChannel, volume);
                    return interaction.reply ({ content: `🔊 The volume level has been set to: ${volume}%.`});                
                case "stop":
                    await queue.stop();
                    embed.setColor('#ff0000').setDescription("🛑 The queue has been stopped");
                    return interaction.reply({ embeds: [embed], ephemeral: false});
                case "skip":
                    if (queue.songs.length <= 1) {
                        embed.setColor('#ff0000').setDescription("⚠️ Cannot skip, there's only one song in the queue.");
                        return interaction.reply({ embeds: [embed], ephemeral: false});
                    }
                    await queue.skip();
                    embed.setColor('#ff0000').setDescription("⏩ The track was skipped");
                    return interaction.reply({ embeds: [embed], ephemeral: true});
                case "loop-all":
                    await queue.setRepeatMode(1);
                    embed.setColor('#ff0000').setDescription(`🔁 **The track is looped in mode:** \`All\``)
                    return interaction.reply({ embeds: [embed], ephemeral: true});
                case "loop-queue":
                    await queue.setRepeatMode(2);
                    embed.setColor('#ff0000').setDescription(`\`🔁\` | **The track is looped in mode:** \`Queue\``)
                    return interaction.reply({ embeds: [embed], ephemeral: true});
                case "autoplay":
                    await client.distube.toggleAutoplay(interaction);
                    embed.setColor('#ff0000').setDescription(`📻 Autoplay was toggled.`);
                    return interaction.reply({ embeds: [embed], ephemeral: true});
            }
        } catch(err) {
            console.log(err);
            embed.setColor("#ff0000").setDescription("❌ | Something went wrong...");
            return interaction.reply({ embeds: [embed], ephemeral: true});
        }
     }
}
