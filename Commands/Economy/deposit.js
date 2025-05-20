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
    .setName('deposit')
    .setDescription('Deposit money into your bank')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Amount to deposit')
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

    if (economy[userId].wallet < amount) {
      return interaction.reply({ content: '❌ You do not have that much money in your wallet.', ephemeral: true });
    }

    economy[userId].wallet -= amount;
    economy[userId].bank += amount;

    saveEconomy(economy);

    interaction.reply(`💰 You deposited **${amount}** coins into your bank.`);
  }
};
