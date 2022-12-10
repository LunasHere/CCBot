const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removewarn')
        .setDescription('Removes a warn via Case ID')
        .addStringOption(option => option.setName('caseid').setDescription('The case ID of the warn').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers | PermissionFlagsBits.KickMembers)
        .setDMPermission(false),
    async execute(interaction) {
        const caseid = interaction.options.getString('caseid');
        const warn = await interaction.client.warnManager.getWarn(caseid);
        if (!warn || warn === null) {
            const nowarn = new EmbedBuilder()
                .setAuthor({ name: "CottonCraft Administration", iconURL: "https://i.lunashere.com/cf45a.png" })
                .setDescription(`No warn found with Case ID ${caseid}.`)
                .setColor(0xFF0000)
                .setTimestamp();
            return interaction.reply({ embeds: [nowarn] });
        }
        await interaction.client.warnManager.removeWarn(caseid);
        const embed = new EmbedBuilder()
            .setAuthor({ name: "CottonCraft Administration", iconURL: "https://i.lunashere.com/cf45a.png" })
            .setDescription(`Warn with Case ID ${caseid} has been removed.`)
            .setColor(0xFF0000)
            .setTimestamp();
        interaction.reply({ embeds: [embed] });

    }
}