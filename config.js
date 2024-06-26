// config.js
const { readFileSync } = require('fs');
const prefixSchema = require('./Schemas/prefixSchema');

async function getPrefix(guildId) {
  const prefixData = await prefixSchema.findOne({ guildId });
  return prefixData ? prefixData.prefix : "+"; // Default prefix '+'
}


module.exports = {
  token: process.env.token || readFileSync('token.txt', 'utf-8'),
  getPrefix, // Exporting the function to fetch prefix dynamically
  clientId: process.env.clientId || "1229438321395109929",
  ownerIds: ["1081995719210172497", "1229341293176557570", "1153611682250227764"], // Array of owner IDs
  mongoURL: process.env.mongoURL || readFileSync('mongoURL.txt', 'utf-8'),
};