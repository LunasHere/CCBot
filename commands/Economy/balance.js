const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Check your balance')
        .addUserOption(option => option.setName('user').setDescription('The user to check the balance of')),
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        const balance = await interaction.client.economyManager.getBalance(interaction.user);
        const embed = new EmbedBuilder()
            .setTitle(`${interaction.user.username}'s Balance`)
            .setDescription(`🪙 | **Balance:** ${balance} coins`);
        interaction.reply({ embeds: [embed] });
    },
};