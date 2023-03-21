const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('adduser')
        .setDescription('Adds a user to the ticket')
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .setDMPermission(false)
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to add')
                .setRequired(true)),
    async execute(interaction) {
        // Check if the channel is a ticket
        if (!interaction.channel.name.startsWith('ticket-')) return interaction.reply({ content: 'This is not a ticket!', ephemeral: true });
        
        // Get the user
        const user = interaction.options.getUser('user');

        // Check if the user is already in the channel
        if (interaction.channel.permissionsFor(user.id).has("ViewChannel", true)) return interaction.reply({ content: 'User is already part of the ticket!', ephemeral: true });

        // Add the user to the channel
        interaction.channel.permissionOverwrites.create(user.id, {
            ViewChannel: true,
            SendMessages: true,
            ReadMessageHistory: true,
        });

        // Create the embed
        const embed = new EmbedBuilder()
            .setAuthor({ name: `${interaction.client.config.botname} Moderation`, iconURL: `${interaction.client.config.boticon}` })
            .setDescription(`**${user}** has been added to the ticket!`)
            .setColor(0xFF0000)
            .setTimestamp();
        // Send a message to the user
        interaction.reply({ embeds: [embed] });
    }
}