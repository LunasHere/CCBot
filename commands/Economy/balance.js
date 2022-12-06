const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Check your balance'),
    async execute(interaction) {
        const balance = await interaction.client.economyManager.getBalance(interaction.user);
        const embed = new EmbedBuilder()
            .setTitle(`${user.username}'s Balance`)
            .setDescription(`🪙 | **Balance:** ${balance} coins`);
        interaction.reply({ embeds: [embed] });
    },
};