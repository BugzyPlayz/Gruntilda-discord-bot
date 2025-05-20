const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('discogs')
    .setDescription('Search for music info from Discogs')
    .addStringOption(option =>
      option.setName('query')
        .setDescription('Search query (artist, album, or song)')
        .setRequired(true)
    ),

  async execute(interaction) {
    const query = interaction.options.getString('query');
    const token = process.env.DISCOGS_API_KEY; // Make sure this is your *user token* from Discogs

    await interaction.deferReply();

    try {
      const response = await axios.get('https://api.discogs.com/database/search', {
        params: {
          q: query,
          per_page: 1,
        },
        headers: {
          'Authorization': `Discogs token=${token}`,
          'User-Agent': 'DiscordBot/1.0 +https://yourdomain.com',
        },
      });

      const result = response.data.results[0];

      if (!result) {
        return interaction.editReply(`❌ No results found for **${query}**.`);
      }

      const embed = new EmbedBuilder()
        .setColor('Purple')
        .setTitle(result.title || 'No Title')
        .setURL(result.resource_url || 'https://www.discogs.com')
        .setThumbnail(result.cover_image || null)
        .addFields(
          { name: 'Type', value: result.type || 'N/A', inline: true },
          { name: 'Genre', value: result.genre?.join(', ') || 'Unknown', inline: true },
          { name: 'Year', value: result.year?.toString() || 'Unknown', inline: true }
        )
        .setFooter({ text: 'Results from Discogs.com' });

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error('Discogs error:', error.response?.data || error.message);
      await interaction.editReply('⚠️ There was an error retrieving data from Discogs. Please try again later.');
    }
  },
};
