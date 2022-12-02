const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rerollgiveaway')
        .setDescription('Reroll a giveaway with the given message ID')
        .addStringOption((option) =>
            option
                .setName('messageid')
                .setDescription('The message id of the giveaway')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers | PermissionFlagsBits.KickMembers),
    async execute(interaction) {
        const messageid = interaction.options.getString('messageid');
        interaction.client.giveawayManager.reroll(messageid).then(() => {
            interaction.reply({ content: `Giveaway rerolled!`, ephemeral: true });
        }).catch((err) => {
            interaction.reply({ content: `There was an error rerolling the giveaway!`, ephemeral: true });
            console.log(err);
        });
    },
};
