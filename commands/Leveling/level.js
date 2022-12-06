const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('level')
        .setDescription('Check your level'),
    async execute(interaction) {
        const level = await interaction.client.levelingManager.getLevel(interaction.user);
        const embed = new EmbedBuilder()
            .setTitle(`${interaction.user.username}'s Level`)
            .setDescription(`📊 | **Level:** ${level}`);
        interaction.reply({ embeds: [embed] });
    }
}