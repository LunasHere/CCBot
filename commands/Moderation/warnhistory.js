const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warnhistory')
        .setDescription('Shows a user\'s warn history')
        .addUserOption(option => option.setName('user').setDescription('The user to show the warn history of').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers | PermissionFlagsBits.KickMembers)
        .setDMPermission(false),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const warns = await interaction.client.warnManager.getWarnsForUser(user);
        if (warns.length === 0) {
            const nowarns = new EmbedBuilder()
                .setAuthor({ name: `${interaction.client.config.botname} Moderation`, iconURL: `${interaction.client.config.boticon}` })
                .setDescription(`**${user.username}#${user.discriminator}** has no warns.`)
                .setColor(0xFF0000)
                .setTimestamp();
            return interaction.reply({ embeds: [nowarns] });
        }
        const desc = '------------------------\n\n' 
            + warns.map(warn => `**Case ID:** ${warn.caseid}\n**Reason:** ${warn.reason}\n**Moderator:** ${warn.warnedby}\n**Date:** ${warn.date}\n`).join('\n------------------------\n\n') 
            + '\n------------------------\n\n';
        const embed = new EmbedBuilder()
            .setAuthor({ name: `${interaction.client.config.botname} Moderation`, iconURL: `${interaction.client.config.boticon}` })
            .setDescription(`**${user.username}#${user.discriminator}**'s warn history is as follows:\n\n${desc}`)
            .setColor(0xFF0000)
            .setTimestamp();
        interaction.reply({ embeds: [embed] });
    }
}