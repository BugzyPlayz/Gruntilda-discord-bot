const fs = require('fs');
const path = require('path');
const { SlashCommandBuilder } = require('discord.js');

const economyPath = path.join(__dirname, '../../data/economy.json');

function readEconomy() {
  if (!fs.existsSync(economyPath)) fs.writeFileSync(economyPath, '{}');
  return JSON.parse(fs.readFileSync(economyPath));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('inventory')
    .setDescription('Check your inventory of purchased items.'),

  async execute(interaction) {
    const userId = interaction.user.id;
    const economy = readEconomy();

    if (!economy[userId] || !economy[userId].inventory || economy[userId].inventory.length === 0) {
      return interaction.reply({
        content: '🧺 Your inventory is empty.',
        ephemeral: false,
      });
    }

    const inventoryList = economy[userId].inventory
      .map((item, index) => `${index + 1}. ${item}`)
      .join('\n');

    return interaction.reply({
      content: `🎒 **Your Inventory:**\n${inventoryList}`,
      ephemeral: false,
    });
  }
};
