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
            hasAttachment = false;
            const attachment = await discordTranscripts.createTranscript(interaction.channel, {
                limit: -1, // Max amount of messages to fetch. `-1` recursively fetches.
                returnType: `${config.ticketuploading.enabled ? "buffer" : "attachment"}`, // Valid options: 'buffer' | 'string' | 'attachment' Default: 'attachment' OR use the enum ExportReturnType
                saveImages: true, // Download all images and include the image data in the HTML (allows viewing the image even after it has been deleted) (! WILL INCREASE FILE SIZE !)
                poweredBy: true // Whether to include the "Powered by discord-html-transcripts" footer
            });
            if(config.ticketuploading.enabled == true) {
                const form = new FormData();
                form.append('transcript', attachment, `${interaction.channel.id}.html`);
                form.append('secret', config.secret);

                // Send the transcipt html file to upload.php
                axios.post(config.ticketuploading.uploadurl, form)
                .catch(error => {
                    console.log(error)
                    return interaction.reply({ content: 'Error uploading transcript!', ephemeral: true });
                });
            } else {

                hasAttachment = true;
            }
            
            // Get all users in the ticket
            const members = interaction.channel.members;

            const url = `${config.ticketuploading.baseurl}${interaction.channel.id}.html`;

            const embed = new EmbedBuilder()
                .setAuthor({ name: "CottonCraft Administration", iconURL: "https://i.lunashere.com/cf45a.png" })
                .setDescription(`Thank you for contacting our support! Your ticket has been closed by a staff member.  You can view the transcript here: ${hasAttachment ? "" : url }`)
                .setColor(0xFF0000)
                .setTimestamp();

            const userEmbed = new EmbedBuilder()
                .setAuthor({ name: "CottonCraft Administration", iconURL: "https://i.lunashere.com/cf45a.png" })
                .setDescription(`You have closed a ticket.  You can view the transcript here: ${hasAttachment ? "" : url }`)
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
                    if(hasAttachment == true) {
                        member.send({ embeds: [embed], files: [attachment] }).catch(err => console.log(err));
                    } else {
                        member.send({ embeds: [embed] }).catch(err => console.log(err));
                    }
                }
            });

            // Send a message to the user
            if(hasAttachment == true) {
                interaction.user.send({ embeds: [userEmbed], files: [attachment] }).catch(err => console.log(err));
            } else {
                interaction.user.send({ embeds: [userEmbed] }).catch(err => console.log(err));
            }

            // Reply to message
            interaction.reply({ content: 'Closing ticket...', ephemeral: true });
            
            // Delete the channel
            interaction.channel.delete();
            
        } else {
            // Send a message to the user
            interaction.reply({ content: 'This is not a ticket!', ephemeral: true });
        }
    }
}