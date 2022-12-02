const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('startgiveaway')
        .setDescription('Start a giveaway in the current channel')
        .addStringOption((option) =>
            option
                .setName('duration')
                .setDescription('The duration of the giveaway')
                .setRequired(true)
        )
        .addNumberOption((option) =>
            option
                .setName('winners')
                .setDescription('The number of winners')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('prize')
                .setDescription('The prize for the giveaway')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers | PermissionFlagsBits.KickMembers),
    async execute(interaction) {
        const duration = interaction.options.getString('duration');
        const winners = interaction.options.getNumber('winners');
        const prize = interaction.options.getString('prize');

        interaction.client.giveawayManager.start(interaction.channel, {
            duration: ms(duration),
            winnerCount: winners,
            prize: prize
        }).then((data) => {
            interaction.reply({ content: `Giveaway started in ${interaction.channel.name}!`, ephemeral: true });
        }).catch((err) => {
            interaction.reply({ content: `There was an error starting the giveaway in ${interaction.channel.name}!`, ephemeral: true });
            console.log(err);
        });
        
    },
};




