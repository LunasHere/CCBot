const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warns a user')
        .addUserOption(option => option.setName('user').setDescription('The user to warn').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for the warning').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers | PermissionFlagsBits.KickMembers)
        .setDMPermission(false),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        // Check if the user is trying to warn themselves
        if (user.id === interaction.user.id) return interaction.reply({ content: 'You cannot warn yourself', ephemeral: true });
        // Check if the user is trying to warn a bot
        if (user.bot) return interaction.reply({ content: 'You cannot warn a bot', ephemeral: true });
        const reason = interaction.options.getString('reason');
        const warns = await interaction.client.warnManager.getNumOfWarns(user);
        let caseid;
        await interaction.client.warnManager.addWarn(user, interaction.user, reason).then(id =>{
            caseid = id;
        }).catch(err => {
            console.error(err);
            return interaction.reply({ content: 'An error occurred while adding the warn', ephemeral: true });
        });
        const channel = interaction.guild.channels.cache.find(ch => ch.name === 'mod-logs');
        if (!channel) return;
        const modembed = new EmbedBuilder()
            .setDescription(`**${user.username}#${user.discriminator}** has been warned by **${interaction.user}** for **${reason}**`)
            .addFields({ name: 'Warnings', value: `${warns + 1}`, inline: true }, { name: 'Case ID', value: `${caseid}`, inline: true })
            .setAuthor({ name: "CottonCraft Administration", iconURL: "https://i.lunashere.com/cf45a.png" })
            .setColor(0xFF0000)
            .setTimestamp();
        channel.send({ embeds: [modembed] });

        const userembed = new EmbedBuilder()
            .setDescription(`You have been warned in **${interaction.guild.name}**.  Please be sure to read the rules and follow them.  If you continue to break the rules, you will be kicked or banned.`)
            .setAuthor({ name: "CottonCraft Administration", iconURL: "https://i.lunashere.com/cf45a.png" })
            .addFields({ name: 'Reason', value: reason, inline: true }, { name: 'Warnings', value: `${warns + 1}`, inline: true }, { name: 'Case ID', value: `${caseid}`, inline: true })
            .setColor(0xFF0000)
            .setTimestamp();
        user.send({ embeds: [userembed] });

        const embed = new EmbedBuilder()
            .setDescription(`**${user}** has been warned.`)
            .addFields({ name: 'Reason', value: reason, inline: true })
            .setAuthor({ name: "CottonCraft Administration", iconURL: "https://i.lunashere.com/cf45a.png" })
            .setColor(0xFF0000)
            .setTimestamp();
        interaction.channel.send({ embeds: [embed] });

        interaction.reply({ content: `**${user}** has been warned`, ephemeral: true });
    }
}