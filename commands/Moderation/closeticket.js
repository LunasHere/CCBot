const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const discordTranscripts = require('discord-html-transcripts');
const axios = require('axios');
const config = require('../../config.json');
const FormData = require('form-data');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('closeticket')
        .setDescription('Closes a ticket')
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .setDMPermission(false),
    async execute(interaction) {
        // Check if the channel is a ticket
        if (interaction.channel.name.startsWith('ticket-')) {

            const attachment = await discordTranscripts.createTranscript(interaction.channel, {
                limit: -1, // Max amount of messages to fetch. `-1` recursively fetches.
                returnType: 'buffer', // Valid options: 'buffer' | 'string' | 'attachment' Default: 'attachment' OR use the enum ExportReturnType
                saveImages: true, // Download all images and include the image data in the HTML (allows viewing the image even after it has been deleted) (! WILL INCREASE FILE SIZE !)
                poweredBy: true // Whether to include the "Powered by discord-html-transcripts" footer
            });

            const form = new FormData();
            form.append('transcript', attachment, `${interaction.channel.id}.html`);
            form.append('secret', config.secret);

            // Send the transcipt html file to upload.php
            axios.post(config.ticketuploadurl, form)
            .catch(error => {
                console.log(error)
                return interaction.reply({ content: 'Error uploading transcript!', ephemeral: true });
            });

            // Delete the channel
            interaction.channel.delete();

            // Get all users in the ticket
            const members = interaction.channel.members;

            const embed = new EmbedBuilder()
                .setAuthor({ name: "CottonCraft Administration", iconURL: "https://i.lunashere.com/cf45a.png" })
                .setDescription(`Thank you for contacting our support! Your ticket has been closed by a staff member.  You can view the transcript here: ${config.baseticketurl}${interaction.channel.id}.html`)
                .setColor(0xFF0000)
                .setTimestamp();

            // Search for staff role in guild
            const staffRole = interaction.guild.roles.cache.find(role => role.name === 'Staff');

            if(!staffRole) return interaction.reply({ content: 'Staff role not found!', ephemeral: true });

            // Loop through all users
            members.forEach(member => {
                // Check if user has the staff role
                if (!member.roles.cache.has(staffRole.id) && !member.user.bot) {
                    // Send the user a message
                    member.send({ embeds: [embed] });
                }
            });

            const userEmbed = new EmbedBuilder()
                .setAuthor({ name: "CottonCraft Administration", iconURL: "https://i.lunashere.com/cf45a.png" })
                .setDescription(`You have closed a ticket.  You can view the transcript here: ${config.baseticketurl}${interaction.channel.id}.html`)
                .setColor(0xFF0000)
                .setTimestamp();

            // Send a message to the user
            interaction.user.send({ embeds: [userEmbed] });

            interaction.reply({ content: 'Ticket closed!', ephemeral: true });
            
        } else {
            // Send a message to the user
            interaction.reply({ content: 'This is not a ticket!', ephemeral: true });
        }
    }
}