const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('spotify')
    .setDescription('Searches Spotify and returns the top result')
    .addStringOption(option =>
      option.setName('query')
        .setDescription('Search term (song, artist, or album)')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('type')
        .setDescription('Type of content to search for')
        .setRequired(true)
        .addChoices(
          { name: 'Track', value: 'track' },
          { name: 'Artist', value: 'artist' },
          { name: 'Album', value: 'album' }
        )
    ),

  async execute(interaction) {
    const query = interaction.options.getString('query');
    const type = interaction.options.getString('type');
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    await interaction.deferReply();

    try {
      // Get access token
      const tokenRes = await axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
        }
      });

      const accessToken = tokenRes.data.access_token;

      // Search
      const searchRes = await axios.get('https://api.spotify.com/v1/search', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        params: {
          q: query,
          type: type,
          limit: 1
        }
      });

      const item = searchRes.data[`${type}s`].items[0];

      if (!item) {
        return interaction.editReply(`❌ No ${type} found for "${query}".`);
      }

      const embed = new EmbedBuilder()
        .setColor('Green')
        .setTitle(item.name)
        .setURL(item.external_urls.spotify)
        .setFooter({ text: `Spotify ${type.charAt(0).toUpperCase() + type.slice(1)}` });

      if (type === 'track') {
        embed.setDescription(`By ${item.artists.map(artist => artist.name).join(', ')}`);
        embed.setThumbnail(item.album.images[0]?.url);
      } else if (type === 'artist') {
        embed.setThumbnail(item.images[0]?.url);
      } else if (type === 'album') {
        embed.setThumbnail(item.images[0]?.url);
        embed.setDescription(`By ${item.artists.map(artist => artist.name).join(', ')}`);
      }

      await interaction.editReply({ embeds: [embed] });

    } catch (err) {
      console.error(err);
      await interaction.editReply('⚠️ Error fetching Spotify data.');
    }
  },
};
