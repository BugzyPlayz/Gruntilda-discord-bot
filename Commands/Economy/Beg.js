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
    .setName('beg')
    .setDescription('Beg strangers for coins.'),

  async execute(interaction) {
    const userId = interaction.user.id;
    const cooldowns = getCooldownData();
    const economy = getEconomyData();

    const cooldown = 30 * 60 * 1000; // 30 minutes
    const now = Date.now();

    if (cooldowns.beg?.[userId] && now - cooldowns.beg[userId] < cooldown) {
      const remaining = cooldown - (now - cooldowns.beg[userId]);
      const mins = Math.floor(remaining / 60000);
      const secs = Math.floor((remaining % 60000) / 1000);
      return interaction.reply({
        content: `🧍 You're too embarrassed to beg again right now. Try again in ${mins}m ${secs}s.`,
        ephemeral: true,
      });
    }

    const donors = [
      'Elon Musk',
      'MrBeast',
      'A kind grandma',
      'A Twitch viewer',
      'A bored billionaire',
      'A suspicious guy in an alley',
      'A catgirl cosplayer',
      'Your ex',
      'Santa Claus',
      'An alien in a trench coat'
    ];
    const donor = donors[Math.floor(Math.random() * donors.length)];
    const amount = Math.random() < 0.3 ? 0 : Math.floor(Math.random() * 51) + 10; // 0 or 10-60 coins

    if (!economy[userId]) {
      economy[userId] = { wallet: 0, bank: 0 };
    }

    if (!cooldowns.beg) cooldowns.beg = {};
    cooldowns.beg[userId] = now;

    saveCooldownData(cooldowns);

    if (amount === 0) {
      return interaction.reply(`🚫 You begged ${donor}, but they ignored you completely. Better luck next time.`);
    }

    economy[userId].wallet += amount;
    saveEconomyData(economy);

    await interaction.reply(`💸 ${donor} gave you **${amount} coins**!`);
  }
};
