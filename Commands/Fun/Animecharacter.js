const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('search-anime-character')
    .setDescription('Search for an anime character using MyAnimeList.')
    .addStringOption(option =>
      option.setName('name')
        .setDescription('Name of the anime character')
        .setRequired(true)
    ),

  async execute(interaction) {
    const characterName = interaction.options.getString('name');
    await interaction.deferReply();

    try {
      // Use Jikan API to search for characters
      const response = await axios.get(`https://api.jikan.moe/v4/characters?q=${encodeURIComponent(characterName)}&limit=1`);

      const character = response.data.data[0];

      if (!character) {
        return await interaction.editReply(`❌ No results found for **${characterName}**.`);
      }

      const embed = new EmbedBuilder()
        .setColor('Purple')
        .setTitle(character.name)
        .setURL(character.url)
        .setThumbnail(character.images.jpg.image_url)
        .setDescription(character.about ? character.about.substring(0, 1024) + '...' : 'No description available.')
        .addFields(
          { name: 'Favorites', value: character.favorites.toString(), inline: true },
          { name: 'Kanji Name', value: character.name_kanji || 'N/A', inline: true }
        )
        .setFooter({ text: 'Data from MyAnimeList (via Jikan API)' });

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error('Error fetching character data:', error);
      await interaction.editReply('❌ Failed to fetch character info. Try again later.');
    }
  },
};
