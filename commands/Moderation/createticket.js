const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createticket')
        .setDescription('Creates a ticket')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to add')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('type')
                .setDescription('The type of ticket')
                .setRequired(true)
                .addChoices({
                    name: 'Player Report',
                    value: 'report'
                }, {
                    name: 'Bug Report',
                    value: 'bug'
                }, {
                    name: 'Other',
                    value: 'other'
                }
                )),
    async execute(interaction) {
        // Get the user
        const user = interaction.options.getUser('user');
        // Get the type
        const type = interaction.options.getString('type');
        // Create the ticket
        const channel = await interaction.client.ticketManager.createTicket(interaction.guild, user, type, `Ticket created by staff member ${interaction.user}`);
        // Create embed
        const embed = new EmbedBuilder()
            .setAuthor({ name: "CottonCraft Administration", iconURL: "https://i.lunashere.com/cf45a.png" })
            .setDescription(`This ticket has been created by **${interaction.user}** for **${user}**!`)
            .setColor(0xFF0000)
            .setTimestamp();
        // Send a message to the user
        channel.send({ embeds: [embed] });
        // Send a message to the staff
        interaction.reply({ content: `Ticket created for **${user}**!`, ephemeral: true });
    }
}