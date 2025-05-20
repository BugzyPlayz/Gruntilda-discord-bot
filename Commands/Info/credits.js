const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('devinfo')
    .setDescription('Displays developer info.'),

  async execute(interaction) {
    // Main embed
    const mainEmbed = new EmbedBuilder()
      .setTitle('About Bugzy')
      .setDescription(
        `Hello, Myself **Bugzy**(bugzy.mp4).\n\n` +
        `✨ **Thank you for using this code!**\n` +
        `🤖 This is a **Multipurpose Discord Bot** I created using **Discord.js V14**.\n\n` +
        `⭐ Thanks for using the bot! If you have any questions or need help, feel free to reach out.\n`
      )
      .setColor(0x000000);

    // Buttons for links
    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('YouTube')
        .setStyle(ButtonStyle.Link)
        .setURL('https://www.youtube.com/@BugzyMP4'),
      new ButtonBuilder()
        .setLabel('Discord Server')
        .setStyle(ButtonStyle.Link)
        .setURL('https://discord.gg/3D5wWMTdD4'),
      new ButtonBuilder()
        .setLabel('Twitter')
        .setStyle(ButtonStyle.Link)
        .setURL('x.com/bugzyMP4'),
      new ButtonBuilder()
        .setLabel('Portfolio')
        .setStyle('ButtonStyle.Link') // Interactive button for projects
        .setURL(bugzysportfolio.carrd.co)
    );

    // Send initial message
    await interaction.reply({ embeds: [mainEmbed], components: [buttons] });
  },
};

/**********************************************************
 * @INFO
 * Bot Coded by PHV DEVELOPMENT | https://discord.gg/YeHzYykQHd
 * @INFO
 * YouTube: UNKNOWN PHV | https://www.youtube.com/@phvdev04/
 * @INFO
 * Do Not Remove Credits | You can Make Modifications in command files if you find a Potential error.
 * @INFO
 *********************************************************/
