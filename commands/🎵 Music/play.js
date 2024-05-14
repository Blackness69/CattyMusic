const client = require("../../index")

module.exports = {
  name: 'play',
  aliases: ['p'],
  description: 'Play a song',
  async execute({msg args}) {
    const guild = msg.guild;
    const query = args[0].join(' ');
    const channel = msg.channel;
    const member = msg.author;
    const voiceChannel = member.voice.channel;

    const embed = new EmbedBuilder();

    if (!voiceChannel) {
        embed.setColor("#ff0000").setDescription("You must be on a voice channel!");
        return msg.reply({ embeds: [embed] });
    }

    if (!member.voice.channelId == guild.members.me.voice.channelId) {
        embed.setColor("#ff0000").setDescription(`You cannot use the music system because it is already active in the: <#${guild.members.me.voice.channelId}>`);
        return msg.reply({ embeds: [embed] });
    }

    client.distube.play(voiceChannel, query, {textChannel: channel, member: member});
    return msg.reply("🎶 Request received.");
  },
};