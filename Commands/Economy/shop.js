const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const shopPath = path.join(__dirname, '../../data/shop.json');

// Default shop if file doesn't exist
const defaultShop = [
  { name: 'Laptop', price: 500 },
  { name: 'Fishing Rod', price: 250 },
  { name: 'Pickaxe', price: 300 },
  { name: 'Bag', price: 150 }
];

function loadShop() {
  if (!fs.existsSync(shopPath)) {
    fs.writeFileSync(shopPath, JSON.stringify(defaultShop, null, 2));
  }
  return JSON.parse(fs.readFileSync(shopPath));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shop')
    .setDescription('View available items in the shop'),

  async execute(interaction) {
    const shop = loadShop();

    if (shop.length === 0) {
      return interaction.reply('🛒 The shop is currently empty.');
    }

    const shopList = shop
      .map((item, index) => `**${index + 1}. ${item.name}** — 💰 ${item.price} coins`)
      .join('\n');

    interaction.reply({
      embeds: [{
        title: '🛍️ Gruntilda\'s Shop',
        description: shopList,
        color: 0x00ff99
      }]
    });
  }
};
