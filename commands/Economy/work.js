const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('work')
        .setDescription('Work for some coins'),
    async execute(interaction) {
        const cooldown = await interaction.client.cooldownManager.getCooldown('work', interaction.user);
        if (cooldown > Date.now()) {
            return interaction.reply({ content: `You are on cooldown for ${ms(cooldown - Date.now(), { long: true })}!`, ephemeral: true });
        }
        
        const amount = Math.floor(Math.random() * 26) + 25;
        interaction.client.economyManager.addBalance(interaction.user, amount);
        interaction.client.cooldownManager.addCooldown('work', interaction.user, 86400000);
        const embed = new EmbedBuilder()
            .setTitle(`${interaction.client.config.botname} Work`)
            .setDescription(`🪙 | You worked and earned ${amount} coins!`)
            .setColor(0x00FF00)
            .setTimestamp();
        interaction.reply({ embeds: [embed] });
    }
};
