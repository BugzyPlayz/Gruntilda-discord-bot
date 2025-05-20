const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('howgay')
    .setDescription('Shows how gay someone is (for fun)!')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('Select a user')
        .setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const gayPercent = Math.floor(Math.random() * 101); // 0 to 100

    const embed = new EmbedBuilder()
      .setColor('LuminousVividPink')
      .setTitle('🌈 How Gay Are You?')
      .setDescription(`**${user.username}** is **${gayPercent}%** gay! 🏳️‍🌈`)
      .setFooter({ text: 'Totally scientific and 100% accurate 😎' });

    await interaction.reply({ embeds: [embed] });
  },
};