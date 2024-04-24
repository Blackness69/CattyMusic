// messageCreate.js

const { getPrefix, ownerIds } = require('../config');
const Discord = require('discord.js');
const client = require(process.cwd() + '/index.js');

client.on("messageCreate", async msg => {
  if (!msg.content || msg.author.bot) return;

  const botMention = msg.content === `<@${client.user.id}>`;
  if (botMention) {
    return msg.reply(`Who pinged me? Oh hey ${msg.author.displayName}! Nice to meet you <3`);
  }

  const currentPrefix = (await getPrefix(msg.guild.id)).toLowerCase();
  if (!msg.content.toLowerCase().startsWith(currentPrefix) && !msg.content.toLowerCase().startsWith("+") || msg.author.bot) return;

  let prefixLength = msg.content.toLowerCase().startsWith(currentPrefix) ? currentPrefix.length : 2;
  if (!msg.content.toLowerCase().startsWith(currentPrefix)) {
    prefixLength = 1; // Default prefix length '+'
  }

  const args = msg.content.slice(prefixLength).trim().split(/ +/);

  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName) || client.commands.get(client.aliases.get(commandName));
  if (command) {
    try {
      await command.execute({ client, Discord, args, prefix: currentPrefix, msg });
    } catch (error) {
      console.error(error);
      return msg.reply('There was an error executing that command!');
    }
  }
});