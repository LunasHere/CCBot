const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const discordTranscripts = require('discord-html-transcripts');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('closeticket')
        .setDescription('Closes a ticket')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
    async execute(interaction) {
        // Check if the channel is a ticket
        if (interaction.channel.name.startsWith('ticket-')) {

            const attachment = await discordTranscripts.createTranscript(interaction.channel, {
                limit: -1, // Max amount of messages to fetch. `-1` recursively fetches.
                returnType: 'string', // Valid options: 'buffer' | 'string' | 'attachment' Default: 'attachment' OR use the enum ExportReturnType
                saveImages: true, // Download all images and include the image data in the HTML (allows viewing the image even after it has been deleted) (! WILL INCREASE FILE SIZE !)
                poweredBy: true // Whether to include the "Powered by discord-html-transcripts" footer
            });

            // Save attachment /ticket folder
            fs.writeFileSync(`./public/tickets/${interaction.channel.name}.html`, `${attachment}`);

/*
            // Delete the channel
            interaction.channel.delete();
            // Send a message to the user
            */
            interaction.reply({ content: 'Ticket closed!', ephemeral: true });
            
        } else {
            // Send a message to the user
            interaction.reply({ content: 'This is not a ticket!', ephemeral: true });
        }
    }
}