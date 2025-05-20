const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const ecoPath = path.join(__dirname, '../../data/economy.json');

function loadEconomy() {
  if (!fs.existsSync(ecoPath)) fs.writeFileSync(ecoPath, '{}');
  return JSON.parse(fs.readFileSync(ecoPath));
}

function saveEconomy(data) {
  fs.writeFileSync(ecoPath, JSON.stringify(data, null, 2));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('withdraw')
    .setDescription('Withdraw money from your bank into your wallet')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Amount to withdraw')
        .setRequired(true)
    ),

  async execute(interaction) {
    const userId = interaction.user.id;
    const amount = interaction.options.getInteger('amount');
    const economy = loadEconomy();

    if (!economy[userId]) {
      economy[userId] = { wallet: 0, bank: 0 };
    }

    if (amount <= 0) {
      return interaction.reply({ content: '❌ Amount must be greater than 0.', ephemeral: true });
    }

    if (economy[userId].bank < amount) {
      return interaction.reply({ content: '❌ You do not have that much money in your bank.', ephemeral: true });
    }

    economy[userId].bank -= amount;
    economy[userId].wallet += amount;

    saveEconomy(economy);

    interaction.reply(`💸 You withdrew **${amount}** coins from your bank.`);
  }
};
