// config.js
const { readFileSync } = require('fs');
const prefixSchema = require('./Schemas/prefixSchema');

async function getPrefix(guildId) {
  const prefixData = await prefixSchema.findOne({ guildId });
  return prefixData ? prefixData.prefix : "+"; // Default prefix 'cp'
}

module.exports = {
  token: process.env.token || readFileSync('token.txt', 'utf-8'),
  getPrefix, // Exporting the function to fetch prefix dynamically
  clientId: process.env.CLIENT_ID,
  ownerIds: ["1081995719210172497", "1229341293176557570"], // Array of owner IDs
  mongoURL: "mongodb+srv://CattyMusic777:cattymusic777999@cattymusic.ood50jh.mongodb.net/",
  YOUTUBE_API_KEY: process.env.YoutubeApiKey
};