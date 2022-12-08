const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('level')
        .setDescription('Check your level')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to check')),
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        const level = await interaction.client.levelingManager.getLevel(user);
        const xp = await interaction.client.levelingManager.getXP(user);
        const embed = new EmbedBuilder()
            .setTitle(`${user.username}'s Level`)
            .setDescription(`📊 | **Level:** ${level}\n\n**XP:** ${xp}/250`)
            .setColor(0x00FF00);
        interaction.reply({ embeds: [embed] });
    }
}