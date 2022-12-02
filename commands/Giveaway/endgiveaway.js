const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('endgiveaway')
        .setDescription('End a giveaway with a message ID')
        .addStringOption((option) =>
            option
                .setName('messageid')
                .setDescription('The ID of the giveaway message')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers | PermissionFlagsBits.KickMembers),
    async execute(interaction) {
        const messageID = interaction.options.getString('messageid');

        interaction.client.giveawayManager.end(messageID).then(() => {
            interaction.reply({ content: `Giveaway ended!`, ephemeral: true });
        }).catch((err) => {
            interaction.reply({ content: `There was an error ending the giveaway!`, ephemeral: true });
            console.log(err);
        });
    },
};