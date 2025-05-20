const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const economyPath = path.join(__dirname, '../../data/economy.json');
const cooldownPath = path.join(__dirname, '../../data/cooldowns.json');

function getEconomyData() {
  if (!fs.existsSync(economyPath)) fs.writeFileSync(economyPath, JSON.stringify({}));
  return JSON.parse(fs.readFileSync(economyPath));
}

function getCooldownData() {
  if (!fs.existsSync(cooldownPath)) fs.writeFileSync(cooldownPath, JSON.stringify({}));
  return JSON.parse(fs.readFileSync(cooldownPath));
}

function saveEconomyData(data) {
  fs.writeFileSync(economyPath, JSON.stringify(data, null, 2));
}

function saveCooldownData(data) {
  fs.writeFileSync(cooldownPath, JSON.stringify(data, null, 2));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('work')
    .setDescription('Do a job to earn coins!'),

  async execute(interaction) {
    const userId = interaction.user.id;
    const cooldowns = getCooldownData();
    const economy = getEconomyData();

    const cooldown = 60 * 60 * 1000; // 1 hour
    const now = Date.now();

    if (cooldowns.work?.[userId] && now - cooldowns.work[userId] < cooldown) {
      const remaining = cooldown - (now - cooldowns.work[userId]);
      const mins = Math.floor(remaining / 60000);
      const secs = Math.floor((remaining % 60000) / 1000);
      return interaction.reply({
        content: `⏳ You must wait ${mins}m ${secs}s before working again.`,
        ephemeral: true,
      });
    }

    const jobs = [
      'Programmer',
      'Construction Worker',
      'Chef',
      'Delivery Driver',
      'Teacher',
      'Streamer',
      'Taxi Driver',
      'Farmer',
      'Artist',
      'Mechanic'
    ];
    const job = jobs[Math.floor(Math.random() * jobs.length)];
    const amount = Math.floor(Math.random() * 201) + 100; // 100-300 coins

    if (!economy[userId]) {
      economy[userId] = { wallet: 0, bank: 0 };
    }

    economy[userId].wallet += amount;
    if (!cooldowns.work) cooldowns.work = {};
    cooldowns.work[userId] = now;

    saveEconomyData(economy);
    saveCooldownData(cooldowns);

    await interaction.reply(`💼 You worked as a **${job}** and earned 💰 **${amount} coins**!`);
  }
};
