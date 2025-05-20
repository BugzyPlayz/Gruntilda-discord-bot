const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "../../Data/levelling.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Shows the top 10 users with the most XP"),

  async execute(interaction) {
    if (!fs.existsSync(dbPath)) return interaction.reply({ content: "❌ No leveling data found!", ephemeral: true });

    const levelingData = JSON.parse(fs.readFileSync(dbPath, "utf8"));
    const guildId = interaction.guild.id;

    // Filter only users from this guild
    const users = Object.entries(levelingData)
      .filter(([key]) => key.startsWith(guildId))
      .map(([key, data]) => ({
        userId: key.split("-")[1],
        xp: data.xp,
        level: data.level,
      }))
      .sort((a, b) => b.xp - a.xp) // Sort by XP
      .slice(0, 10); // Top 10

    if (users.length === 0) {
      return interaction.reply({ content: "❌ No leaderboard data available yet!", ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor("Random")
      .setTitle("🏆 Leaderboard")
      .setDescription(
        users
          .map((user, index) => `**${index + 1}.** <@${user.userId}> - **Level ${user.level}** | 🌟 XP: ${user.xp}`)
          .join("\n")
      )
      .setFooter({ text: "Keep chatting to climb the leaderboard!" });

    interaction.reply({ embeds: [embed] });
  },
};
