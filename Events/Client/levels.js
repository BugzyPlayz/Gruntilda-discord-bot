const { Events } = require("discord.js");
const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "../../Data/levelling.json");
let levelingData = {};

// Load existing data
if (fs.existsSync(dbPath)) {
  levelingData = JSON.parse(fs.readFileSync(dbPath, "utf8"));
}

// Cooldown system to prevent spam XP farming
const cooldowns = new Set();

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot || !message.guild) return;

    const userId = message.author.id;
    const guildId = message.guild.id;

    // Unique key for each user in a server
    const key = `${guildId}-${userId}`;

    // Cooldown check (30 seconds)
    if (cooldowns.has(key)) return;
    cooldowns.add(key);
    setTimeout(() => cooldowns.delete(key), 30000); // 30s cooldown

    // Initialize user data if not exists
    if (!levelingData[key]) {
      levelingData[key] = { xp: 0, level: 1 };
    }

    // Add XP
    const xpGain = Math.floor(Math.random() * 10) + 5; // Random XP between 5-15
    levelingData[key].xp += xpGain;

    // Level up system
    const level = levelingData[key].level;
    const nextLevelXP = level * 100; // XP required to level up
    if (levelingData[key].xp >= nextLevelXP) {
      levelingData[key].level += 1;
      message.channel.send(
        `🎉 <@${userId}>, you leveled up to **Level ${levelingData[key].level}!**`
      );
    }

    // Save to JSON
    fs.writeFileSync(dbPath, JSON.stringify(levelingData, null, 2), "utf8");
  },
};
