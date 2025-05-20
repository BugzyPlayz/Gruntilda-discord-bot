const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('search-game')
    .setDescription('Search for a video game and get details.')
    .addStringOption(option =>
      option.setName('name')
        .setDescription('Name of the video game')
        .setRequired(true)
    ),

  async execute(interaction) {
    const gameName = interaction.options.getString('name');
    await interaction.deferReply();

    try {
      const apiKey = process.env.RAWG_API_KEY;
      const response = await axios.get(`https://api.rawg.io/api/games`, {
        params: {
          key: apiKey,
          search: gameName,
          page_size: 1
        }
      });

      const game = response.data.results[0];

      if (!game) {
        return await interaction.editReply(`❌ No results found for **${gameName}**.`);
      }

      const platforms = game.platforms?.map(p => p.platform.name).join(', ') || 'N/A';
      const genres = game.genres?.map(g => g.name).join(', ') || 'N/A';

      const embed = new EmbedBuilder()
        .setColor('Green')
        .setTitle(game.name)
        .setURL(`https://rawg.io/games/${game.slug}`)
        .setThumbnail(game.background_image)
        .setDescription(`A game released on ${game.released || 'Unknown'}.\n\n**Genres:** ${genres}\n**Platforms:** ${platforms}`)
        .addFields(
          { name: 'Rating', value: `${game.rating} / 5 (${game.ratings_count} votes)`, inline: true },
          { name: 'Released', value: game.released || 'Unknown', inline: true }
        )
        .setFooter({ text: 'Data from RAWG Video Game Database' });

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error('Error fetching game data:', error);
      await interaction.editReply('❌ Failed to fetch game info. Please try again later.');
    }
  },
};
