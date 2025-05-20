const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', '..', 'data', 'economy.json');
const cooldownPath = path.join(__dirname, '..', '..', 'data', 'cooldowns.json');

function readJSON(filePath) {
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, '{}');
  return JSON.parse(fs.readFileSync(filePath));
}

function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Claim your daily reward'),

  async execute(interaction) {
    const userId = interaction.user.id;
    const cooldowns = readJSON(cooldownPath);
    const economy = readJSON(dbPath);

    const now = Date.now();
    const cooldown = 24 * 60 * 60 * 1000; // 24 hours

    if (cooldowns.daily?.[userId] && (now - cooldowns.daily[userId]) < cooldown) {
      const remaining = cooldown - (now - cooldowns.daily[userId]);
      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      return interaction.reply(`🕒 You already claimed your daily. Try again in ${hours}h ${minutes}m.`);
    }

    const amount = Math.floor(Math.random() * 200) + 100;
    if (!economy[userId]) economy[userId] = { wallet: 0, bank: 0 };
    economy[userId].wallet += amount;
    
    if (!cooldowns.daily) cooldowns.daily = {};
    cooldowns.daily[userId] = now;

    writeJSON(dbPath, economy);
    writeJSON(cooldownPath, cooldowns);

    await interaction.reply(`✅ You claimed your daily reward of ${amount} 💰!`);
  }
};
