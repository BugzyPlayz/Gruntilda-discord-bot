const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const Canvas = require("@napi-rs/canvas");

const dbPath = path.join(__dirname, "../../Data/levelling.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("xp")
    .setDescription("Shows your XP as an image")
    .addUserOption(option =>
      option.setName("user").setDescription("Check someone's XP").setRequired(false)
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
    const progress = xp / nextLevelXP;

    // Create Canvas
    const canvas = Canvas.createCanvas(800, 250);
    const ctx = canvas.getContext("2d");

    // Background
    ctx.fillStyle = "#23272A"; // Dark mode background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Avatar
    const avatar = await Canvas.loadImage(targetUser.displayAvatarURL({ extension: "png", size: 128 }));
    ctx.drawImage(avatar, 40, 60, 128, 128);

    // XP Bar Background
    ctx.fillStyle = "#40444B";
    ctx.fillRect(200, 150, 500, 30);

    // XP Progress Bar
    ctx.fillStyle = "#7289DA"; // Discord blurple color
    ctx.fillRect(200, 150, 500 * progress, 30);

    // Text
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 30px Arial";
    ctx.fillText(`${targetUser.username}`, 200, 100);
    ctx.font = "bold 20px Arial";
    ctx.fillText(`Level: ${level}`, 650, 80);
    ctx.fillText(`XP: ${xp}/${nextLevelXP}`, 650, 110);

    // Convert canvas to buffer
    const buffer = await canvas.encode("png");
    const attachment = new AttachmentBuilder(buffer, { name: "xp.png" });

    await interaction.reply({ files: [attachment] });
  },
};
