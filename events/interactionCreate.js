// interaction.js
const client = require(process.cwd() + '/index.js')
const ms = require('pretty-ms');
const {prefix} = require('../config');
const Discord = require('discord.js');

client.on("interactionCreate", async (interaction) => {
  // Add interaction create event handling logic here
  const commandName = interaction.commandName;
  if(!client.slashCommands) return;
  const slashCommand = client.slashCommands.get(commandName);
  if (!slashCommand) return
  try {
    return slashCommand.execute({client, interaction, ms, Discord, prefix});
  } catch (error) {
    console.log(error)
    interaction.reply({
      content: 'There was an error while executing this command!',
      ephemeral: true 
    });
  }
});