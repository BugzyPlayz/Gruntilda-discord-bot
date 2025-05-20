const fs = require('fs');
const path = require('path');
const { SlashCommandBuilder } = require('discord.js');

const economyPath = path.join(__dirname, '../../data/economy.json');
const shopPath = path.join(__dirname, '../../data/shop.json');

function readJSON(filePath) {
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, '{}');
  return JSON.parse(fs.readFileSync(filePath));
}

function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sell')
    .setDescription('Sell an item from your inventory.')
    .addStringOption(option =>
      option.setName('item')
        .setDescription('The name of the item to sell')
        .setRequired(true)
    ),

  async execute(interaction) {
    const userId = interaction.user.id;
    const itemToSell = interaction.options.getString('item').toLowerCase();

    const economy = readJSON(economyPath);
    const shop = readJSON(shopPath);

    if (!economy[userId] || !economy[userId].inventory || economy[userId].inventory.length === 0) {
      return interaction.reply({ content: '🧺 Your inventory is empty.', ephemeral: true });
    }

    const itemIndex = economy[userId].inventory.findIndex(i => i.toLowerCase() === itemToSell);
    if (itemIndex === -1) {
      return interaction.reply({ content: `❌ You don't have **${itemToSell}** in your inventory.`, ephemeral: true });
    }

    const shopItem = shop.find(i => i.name.toLowerCase() === itemToSell);
    if (!shopItem) {
      return interaction.reply({ content: `❌ **${itemToSell}** is not a valid sellable item.`, ephemeral: true });
    }

    const sellPrice = Math.floor(shopItem.price / 2);

    // Remove the item and give coins
    economy[userId].inventory.splice(itemIndex, 1);
    economy[userId].wallet = (economy[userId].wallet || 0) + sellPrice;

    writeJSON(economyPath, economy);

    return interaction.reply(`💰 You sold **${shopItem.name}** for **${sellPrice}** coins.`);
  }
};
