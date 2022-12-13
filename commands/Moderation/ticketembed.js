const { EmbedBuilder, ActionRowBuilder, SlashCommandBuilder, PermissionFlagsBits, ButtonBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticketembed')
        .setDescription('Creates a ticket embed')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setAuthor({ name: "CottonCraft Administration", iconURL: "https://i.lunashere.com/cf45a.png" })
            .setDescription('Please click the button below to create a ticket!')
            .setColor(0xFF0000);
        const row = new ActionRowBuilder()
            .addComponents([
                new ButtonBuilder()
                    .setLabel('Bug Report')
                    .setStyle(1)
                    .setEmoji('🐛')
                    .setCustomId('bug'),
                
                new ButtonBuilder()
                    .setLabel('Report a Player')
                    .setStyle(1)
                    .setEmoji('👮')
                    .setCustomId('report'),
                    
                new ButtonBuilder()
                    .setLabel('Other')
                    .setStyle(1)
                    .setEmoji('❓')
                    .setCustomId('other'),
            ]);
        interaction.channel.send({ embeds: [embed], components: [row] });
        interaction.reply({ content: 'Ticket embed sent!', ephemeral: true });
    }
}