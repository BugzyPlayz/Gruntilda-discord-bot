const fs = require('fs');
const path = require('path');
const { SlashCommandBuilder } = require('discord.js');

const economyPath = path.join(__dirname, '../../data/economy.json');
const shopPath = path.join(__dirname, '../../data/shop.json');

function readEconomy() {
  if (!fs.existsSync(economyPath)) fs.writeFileSync(economyPath, '{}');
  return JSON.parse(fs.readFileSync(economyPath));
}

function writeEconomy(data) {
  fs.writeFileSync(economyPath, JSON.stringify(data, null, 2));
}

function readShop() {
  if (!fs.existsSync(shopPath)) fs.writeFileSync(shopPath, '[]');
  return JSON.parse(fs.readFileSync(shopPath));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('buy')
    .setDescription('Buy an item from the shop.')
    .addStringOption(option =>
      option
        .setName('item')
        .setDescription('The name of the item you want to buy')
        .setRequired(true)
    ),

  async execute(interaction) {
    const userId = interaction.user.id;
    const itemName = interaction.options.getString('item').toLowerCase();

    const economy = readEconomy();
    const shop = readShop();

    const item = shop.find(i => i.name.toLowerCase() === itemName);

    if (!item) {
      return interaction.reply({
        content: '❌ That item doesn’t exist in the shop.',
        ephemeral: true,
      });
    }

    if (!economy[userId]) {
      economy[userId] = { wallet: 0, bank: 0, inventory: [] };
    }

    if (economy[userId].wallet < item.price) {
      return interaction.reply({
        content: `❌ You don’t have enough money. You need $${item.price}.`,
        ephemeral: true,
      });
    }

    economy[userId].wallet -= item.price;

    if (!economy[userId].inventory) {
      economy[userId].inventory = [];
    }

    economy[userId].inventory.push(item.name);

    writeEconomy(economy);

    return interaction.reply(`✅ You bought **${item.name}** for **$${item.price}**.`);
  }
};
