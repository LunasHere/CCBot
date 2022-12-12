const { EmbedBuilder, ChannelType, PermissionFlagsBits, PermissionsBitField } = require('discord.js');
const fs = require('fs');

class TicketManger {
    constructor(client) {
        this.client = client;
    }

    // createTicket function with promise
    createTicket(guild, user, type, description) {
        return new Promise(async (resolve, reject) => {
            // Get staff role
            const staffRole = await guild.roles.cache.find((role) => role.name === 'Staff');
            if(!staffRole) return console.error('Staff role not found!');

            // Get ticket category
            const ticketCategory = await guild.channels.cache.find((channel) => channel.name === 'Tickets');

            // Create the ticket
            await guild.channels.create({
                name: `ticket-${user.username}`,
                type: ChannelType.GuildText
            }).then(channel => {
                channel.setParent(ticketCategory.id);

                // Set permissions
                channel.permissionOverwrites.set([
                    {
                        id: guild.id,
                        deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                    },
                    {
                        id: user.id,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles],
                    },
                    {
                        id: staffRole.id,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles],
                    },
                ]);

                // Send the ticket message

                const embed = new EmbedBuilder()
                    .setTitle('Ticket')
                    .setDescription(`Thank you for creating a ticket! Please be patient while we get to you.`)
                    .addFields({
                            name: 'Type',
                            value: type.charAt(0).toUpperCase() + type.slice(1),
                        },
                        {
                            name: 'Description',
                            value: description,
                        })
                    .setTimestamp()
                    .setColor(0xFF0000);
                channel.send({ content: `${user} ${staffRole.toString()}`, embeds: [embed] });
                resolve(channel);
            }).catch(err => {
                console.error(err);
                reject(err);
            });
        });
    }

}

module.exports = TicketManger;