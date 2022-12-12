const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removeuser')
        .setDescription('Removes a user from the ticket')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to remove')
                .setRequired(true)),
    async execute(interaction) {
        // Check if the channel is a ticket
        if (!interaction.channel.name.startsWith('ticket-')) return interaction.reply({ content: 'This is not a ticket!', ephemeral: true });
        
        // Get the user
        const user = interaction.options.getUser('user');

        // Check if the user is already in the channel
        if (!interaction.channel.permissionsFor(user.id).has("ViewChannel", true)) return interaction.reply({ content: 'User is not part of the ticket!', ephemeral: true });

        // Remove the user from the channel
        interaction.channel.permissionOverwrites.delete(user.id);

        // Create the embed
        const embed = new EmbedBuilder()
            .setAuthor({ name: "CottonCraft Administration", iconURL: "https://i.lunashere.com/cf45a.png" })
            .setDescription(`**${user}** has been removed from the ticket!`)
            .setColor(0xFF0000)
            .setTimestamp();

        // Send a message to the user
        interaction.reply({ embeds: [embed] });

    }
}