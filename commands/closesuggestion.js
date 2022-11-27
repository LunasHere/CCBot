const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('closesuggestion')
		.setDescription('Closes the suggestion')
        .addStringOption(option => 
            option
                .setName('reason')
                .setDescription('Please include a reason for closing this suggestion')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers | PermissionFlagsBits.KickMembers)
        .setDMPermission(false),
	async execute(interaction) {
		// Check if channel is a thread
        if (!interaction.channel.isThread()) {
            await interaction.reply({ content: 'This command can only be used in a thread!', ephemeral: true });
            return;
        }
        // Reply to the user
        await interaction.reply({ content: 'Suggestion closed', ephemeral: true });
        // Create the embed
        const embed = new EmbedBuilder()
            .setTitle('Suggestion Closed')
            .setDescription(`This suggestion has been closed by ${interaction.user}.`)
            .addFields({ name: "Reason", value: interaction.options.getString('reason') })
            .setColor(0xFF0000)
            .setTimestamp();
        // Send a embed to the thread
        await interaction.channel.send({ embeds: [embed] });
        // Close and lock the thread
        await interaction.channel.setArchived(true);
	},
};