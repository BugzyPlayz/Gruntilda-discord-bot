const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "../../Data/levelling.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rank")
    .setDescription("Shows your current level and XP")
    .addUserOption(option =>
      option.setName("user").setDescription("Check someone's rank").setRequired(false)
    ),

  async execute(interaction) {
    const targetUser = interaction.options.getUser("user") || interaction.user;
    const userId = targetUser.id;
    const guildId = interaction.guild.id;
    const key = `${guildId}-${userId}`;

    if (!fs.existsSync(dbPath)) return interaction.reply({ content: "❌ No leveling data found!", ephemeral: true });

    const levelingData = JSON.parse(fs.readFileSync(dbPath, "utf8"));
    const userData = levelingData[key];

    if (!userData) {
      return interaction.reply({ content: `❌ ${targetUser.username} has no XP yet!`, ephemeral: true });
    }

    const { xp, level } = userData;
    const nextLevelXP = level * 100;
    const progress = Math.floor((xp / nextLevelXP) * 100);

    const embed = new EmbedBuilder()
      .setColor("Random")
      .setTitle(`${targetUser.username}'s Rank`)
      .setDescription(`🆙 **Level:** ${level}\n🌟 **XP:** ${xp}/${nextLevelXP} (${progress}%)`)
      .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: "Keep chatting to level up!" });

    interaction.reply({ embeds: [embed] });
  },
};
