const fs = require('fs');
const path = require('path');
const { SlashCommandBuilder } = require('discord.js');

const economyPath = path.join(__dirname, '../../data/economy.json');

function readJSON(filePath) {
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, '{}');
  return JSON.parse(fs.readFileSync(filePath));
}

function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gift')
    .setDescription('Gift coins or an item to another user.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to gift to')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('coins')
        .setDescription('Amount of coins to gift')
    )
    .addStringOption(option =>
      option.setName('item')
        .setDescription('Name of the item to gift')
    ),

  async execute(interaction) {
    const senderId = interaction.user.id;
    const receiver = interaction.options.getUser('user');
    const receiverId = receiver.id;
    const coins = interaction.options.getInteger('coins');
    const item = interaction.options.getString('item');

    if (receiverId === senderId) {
      return interaction.reply({ content: `❌ You can't gift yourself.`, ephemeral: true });
    }

    const economy = readJSON(economyPath);

    // Make sure both users have profiles
    if (!economy[senderId]) {
      economy[senderId] = { wallet: 0, bank: 0, inventory: [] };
    }
    if (!economy[receiverId]) {
      economy[receiverId] = { wallet: 0, bank: 0, inventory: [] };
    }

    // Coin gifting
    if (coins !== null) {
      if (coins <= 0 || isNaN(coins)) {
        return interaction.reply({ content: `❌ Invalid coin amount.`, ephemeral: true });
      }

      if (economy[senderId].wallet < coins) {
        return interaction.reply({ content: `❌ You don't have enough coins to gift.`, ephemeral: true });
      }

      economy[senderId].wallet -= coins;
      economy[receiverId].wallet += coins;

      writeJSON(economyPath, economy);
      return interaction.reply(`💸 You gifted **${coins}** coins to ${receiver.username}.`);
    }

    // Item gifting
    if (item !== null) {
      const itemLower = item.toLowerCase();
      const senderInventory = economy[senderId].inventory.map(i => i.toLowerCase());
      const itemIndex = senderInventory.indexOf(itemLower);

      if (itemIndex === -1) {
        return interaction.reply({ content: `❌ You don't have **${item}** in your inventory.`, ephemeral: true });
      }

      // Remove from sender and add to receiver
      const actualItem = economy[senderId].inventory[itemIndex];
      economy[senderId].inventory.splice(itemIndex, 1);
      economy[receiverId].inventory.push(actualItem);

      writeJSON(economyPath, economy);
      return interaction.reply(`🎁 You gifted **${actualItem}** to ${receiver.username}.`);
    }

    return interaction.reply({ content: `❌ You must specify either coins or an item to gift.`, ephemeral: true });
  }
};
