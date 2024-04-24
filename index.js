const { prefix, token, avatarURL } = require('./config.js');
const fs = require('fs');
const {DisTube} = require("distube");
const {SpotifyPlugin} = require("@distube/spotify");
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const ms = require('pretty-ms');
require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
app.get('/', (req, res) => {
  res.send('Online Yo Boy !');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

const { ActivityType, Collection, GatewayIntentBits, Client, Collector, VoiceChannel, EmbedBuilder } = require('discord.js');

const Discord = require('discord.js');
const client = new Client({
  intents: Object.keys(GatewayIntentBits).map(intent => intent),
  allowedMentions: { repliedUser: false }
});

module.exports = client;

client.commands = new Collection();
client.slashCommands = new Collection();
client.aliases = new Collection();
client.messageTimestamps = new Map();
client.snipes = new Map();
client.messageTimestamps = new Map();
client.cooldowns = new Map();
        const commandFolders = fs.readdirSync('./commands');
        for (const folder of commandFolders) {
          const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
          for (const file of commandFiles) {
            const command = require(`./commands/${folder}/${file}`);
    command.category = folder;
    client.commands.set(command.name, command);
    if(!command.aliases) continue;
    for (const aliase of command.aliases) {
      client.aliases.set(aliase, command.name)
    }

  }
};

const slashCommandFolders = fs.readdirSync('./slashCommands');
for (const folder of slashCommandFolders) {
  const slashCommandFiles = fs.readdirSync(`./slashCommands/${folder}`).filter(file => file.endsWith('.js'));
  for (const file of slashCommandFiles) {
    const slashCommand = require(`./slashCommands/${folder}/${file}`);
    slashCommand.category = folder;
    if (slashCommand.data) {
      client.slashCommands.set(slashCommand.data.name, slashCommand);
    }
  }
}

module.exports = client;
// Load event handler files
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  require(`./events/${file}`);
};

// Load table files
const tableFiles = fs.readdirSync('./tables').filter(file => file.endsWith('.js'));

for (const file of tableFiles) {
 client.on("ready", require(`./tables/${file}`));
}

client.distube = new DisTube(client, {

    leaveOnFinish: true,

    searchCooldown: 10,

    leaveOnEmpty: false,

    leaveOnStop: true,

    emitNewSongOnly: true,

    emitAddSongWhenCreatingQueue: false,

    emitAddListWhenCreatingQueue: false,

    plugins: [

        new SpotifyPlugin({

            emitEventsAfterFetching: true

          }),

        new SoundCloudPlugin(),

        new YtDlpPlugin()

    ]

});



const status = queue =>

    `Volume: \`${queue.volume}%\` |  Filter: \`${queue.filters.names.join(', ') || 'Inactive'}\` | Repeat: \`${queue.repeatMode ? (queue.repeatMode === 2 ? 'Queue' : 'Track') : 'Off'

    }\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``

client.distube

    .on('playSong', (queue, song) =>

        queue.textChannel.send({

            embeds: [new EmbedBuilder().setColor('#ff0000')

                .setDescription(`🎶 | Playing: \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${song.user

                    }\n${status(queue)}`)]

        })

    )

    .on('addSong', (queue, song) =>

        queue.textChannel.send(

            {

                embeds: [new EmbedBuilder().setColor('#ff0000')

                    .setDescription(`🎶 | Added \`${song.name}\` - \`${song.formattedDuration}\` to queue by: ${song.user}`)]

            }

        )

    )

    .on('addList', (queue, playlist) =>

        queue.textChannel.send(

            {

                embeds: [new EmbedBuilder().setColor('#ff0000')

                    .setDescription(`🎶 | Added from \`${playlist.name}\` : \`${playlist.songs.length

                        } \` queue tracks; \n${status(queue)}`)]

            }

        )

    )

    .on('error', (channel, e) => {

        if (channel) channel.send(`⛔ | Error: ${e.toString().slice(0, 1974)}`)

        else console.error(e)

    })

    .on('empty', channel => channel.send({

        embeds: [new EmbedBuilder().setColor("ff0000")

            .setDescription('⛔ | The voice channel is empty! Leaving the channel...')]

    }))

    .on('searchNoResult', (message, query) =>

        message.channel.send(

            {

                embeds: [new EmbedBuilder().setColor("ff0000")

                    .setDescription('`⛔ | No results found for: \`${query}\`!`')]

            })

    )

    .on('finish', queue => queue.textChannel.send({

        embeds: [new EmbedBuilder().setColor('#ff0000')

            .setDescription('🏁 | The queue is finished!')]

    }))

client.login(token);