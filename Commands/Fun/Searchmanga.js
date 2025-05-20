const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('search-manga')
    .setDescription('Search for a manga using MyAnimeList.')
    .addStringOption(option =>
      option.setName('name')
        .setDescription('Name of the manga')
        .setRequired(true)
    ),

  async execute(interaction) {
    const mangaName = interaction.options.getString('name');
    await interaction.deferReply();

    try {
      const response = await axios.get(`https://api.jikan.moe/v4/manga?q=${encodeURIComponent(mangaName)}&limit=1`);

      const manga = response.data.data[0];

      if (!manga) {
        return await interaction.editReply(`❌ No results found for **${mangaName}**.`);
      }

      const embed = new EmbedBuilder()
        .setColor('Blue')
        .setTitle(manga.title)
        .setURL(manga.url)
        .setThumbnail(manga.images.jpg.image_url)
        .setDescription(manga.synopsis ? manga.synopsis.substring(0, 1024) + '...' : 'No synopsis available.')
        .addFields(
          { name: 'Chapters', value: manga.chapters?.toString() || 'N/A', inline: true },
          { name: 'Volumes', value: manga.volumes?.toString() || 'N/A', inline: true },
          { name: 'Score', value: manga.score?.toString() || 'N/A', inline: true },
          { name: 'Status', value: manga.status || 'N/A', inline: true },
          { name: 'Type', value: manga.type || 'N/A', inline: true }
        )
        .setFooter({ text: 'Data from MyAnimeList (via Jikan API)' });

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error('Error fetching manga data:', error);
      await interaction.editReply('❌ Failed to fetch manga info. Try again later.');
    }
  },
};
