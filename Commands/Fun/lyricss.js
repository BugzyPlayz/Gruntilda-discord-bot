const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('search-lyrics')
    .setDescription('Search for the lyrics of a song.')
    .addStringOption(option =>
      option.setName('artist')
        .setDescription('The artist of the song')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('title')
        .setDescription('The title of the song')
        .setRequired(true)),

  async execute(interaction) {
    const artist = interaction.options.getString('artist');
    const title = interaction.options.getString('title');
    await interaction.deferReply();

    try {
      const response = await axios.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`);

      const lyrics = response.data.lyrics;

      if (!lyrics) {
        return await interaction.editReply(`❌ No lyrics found for **${title}** by **${artist}**.`);
      }

      // If lyrics too long for a single embed, trim it
      const trimmedLyrics = lyrics.length > 2000 ? lyrics.substring(0, 1995) + '...' : lyrics;

      const embed = new EmbedBuilder()
        .setColor('Purple')
        .setTitle(`🎵 Lyrics: ${title}`)
        .setDescription(trimmedLyrics)
        .setFooter({ text: `Artist: ${artist}` });

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error('Error fetching lyrics:', error);
      await interaction.editReply(`❌ Could not find lyrics for **${title}** by **${artist}**.`);
    }
  },
};
