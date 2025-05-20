const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', '..', 'data', 'economy.json');

function getBalance(userId) {
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf-8') || '{}');
  return data[userId] || { wallet: 0, bank: 0 };
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Check your or another user\'s balance')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to check')
        .setRequired(false)),
  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    const balance = getBalance(user.id);

    await interaction.reply({
      embeds: [{
        title: `${user.username}'s Balance`,
        color: 0x00AE86,
        fields: [
          { name: 'Wallet', value: `${balance.wallet} 💰`, inline: true },
          { name: 'Bank', value: `${balance.bank} 🏦`, inline: true },
        ]
      }]
    });
  }
};
