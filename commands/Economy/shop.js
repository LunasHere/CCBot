const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const shop = require('../../shop.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shop')
        .setDescription('Shows the shop')
        .addSubcommand(subcommand =>
            subcommand
                .setName('buy')
                .setDescription('Buy an item from the shop')
                .addNumberOption(option =>
                    option.setName('itemid')
                        .setDescription('The ID of the item you want to buy')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('show')
                .setDescription('Show all items in the shop')
        ),
    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'buy') {
            const itemid = interaction.options.getNumber('itemid');
            const item = shop.items.find(i => i.id === itemid);
            if (!item) {
                return interaction.reply({ content: 'That item does not exist!', ephemeral: true });
            }
            if (interaction.client.economyManager.getBalance(interaction.user) < item.price) {
                return interaction.reply({ content: 'You do not have enough money to buy this item!', ephemeral: true });
            }
            interaction.client.economyManager.removeBalance(interaction.user, item.price);
            const embed = new EmbedBuilder()
                .setTitle('CC Shop')
                .setDescription(`🛒 | You bought ${item.name} for ${item.price} coins!  Staff will contact you shortly to deliver your item.`)
                .setColor(0x00FF00)
                .setTimestamp();
            interaction.reply({ embeds: [embed] });
        } else if (interaction.options.getSubcommand() === 'show') {
            const embed = new EmbedBuilder()
                .setTitle('CC Shop')
                .setDescription(shop.items.map(i => `${i.id} | **${i.name}** - ${i.price} coins`).join('\n'))
                .setColor(0x00FF00)
                .setTimestamp();
            interaction.reply({ embeds: [embed] });
        }
    },
};