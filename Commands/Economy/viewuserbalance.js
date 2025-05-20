const fs = require('fs');
const path = require('path');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const economyPath = path.join(__dirname, '../../data/economy.json');

function readJSON(filePath) {
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, '{}');
  return JSON.parse(fs.readFileSync(filePath));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('viewuserbalance')
    .setDescription("View a user's economy profile.")
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to view')
        .setRequired(false)
    ),

  async execute(interaction) {
    const targetUser = interaction.options.getUser('user') || interaction.user;
    const userId = targetUser.id;

    const economy = readJSON(economyPath);

    if (!economy[userId]) {
      return interaction.reply({ content: `❌ ${targetUser.username} doesn't have an economy profile yet.`, ephemeral: true });
    }

    const { wallet = 0, bank = 0, inventory = [] } = economy[userId];

    const embed = new EmbedBuilder()
      .setColor(0x00AE86)
      .setTitle(`${targetUser.username}'s Profile`)
      .addFields(
        { name: '💰 Wallet', value: `${wallet} coins`, inline: true },
        { name: '🏦 Bank', value: `${bank} coins`, inline: true },
        { name: '🎒 Inventory', value: inventory.length > 0 ? inventory.join(', ') : 'Empty', inline: false }
      )
      .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  }
};
