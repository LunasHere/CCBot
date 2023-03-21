const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const shop = require('../../shop.json');
const config = require('../../config.json');

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

            // Check if the user has enough money
            const balance = await interaction.client.economyManager.getBalance(interaction.user);
            if (balance < item.price) {
                return interaction.reply({ content: 'You do not have enough money to buy that item!', ephemeral: true });
            }
            interaction.client.economyManager.removeBalance(interaction.user, item.price);
            const embed = new EmbedBuilder()
                .setTitle(`${interaction.client.config.botname} Economy`)
                .setDescription(`🛒 | You bought ${item.name} for ${item.price} coins!  Staff will contact you shortly to deliver your item.`)
                .setColor(0x00FF00)
                .setTimestamp();
            interaction.reply({ embeds: [embed] });
            const channel = interaction.client.channels.cache.get(config.shoppurchasechannelid);
            const embed2 = new EmbedBuilder()
                .setTitle('CC Shop')
                .setDescription(`🛒 | ${interaction.user} bought ${item.name} for ${item.price} coins!`)
                .setColor(0x00FF00)
                .setTimestamp();
            channel.send({ embeds: [embed2] });
        } else if (interaction.options.getSubcommand() === 'show') {
            const embed = new EmbedBuilder()
                .setTitle(`${interaction.client.config.botname} Economy`)
                .setDescription(shop.items.map(i => `${i.id} | **${i.name}** - ${i.price} coins`).join('\n'))
                .setColor(0x00FF00)
                .setTimestamp();
            interaction.reply({ embeds: [embed] });
        }
    },
};