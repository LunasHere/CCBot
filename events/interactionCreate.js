const { Events, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ComponentType } = require('discord.js');

// New Map to store the user and message id
const Selection = new Map();

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        // Check if the interaction is a command
        if (interaction.isCommand()) {
            // Obtain the command
            const command = interaction.client.commands.get(interaction.commandName);

            // Check if the command exists
            if (!command) return;

            try {
                // Execute the command
                await command.execute(interaction);
            } catch (error) {
                // Log the error and reply to the user
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
            return;
        }

        // Check if the interaction is a button
        if (interaction.isButton()) {
            // Check if the button has a custom id of bug, report, or other
            if (interaction.customId === 'bug' || interaction.customId === 'report' || interaction.customId === 'other') {
                // Create a modal
                const modal = new ModalBuilder()
                    .setTitle('Ticket')
                    .setCustomId('ticket');
                
                // store the user in a variable with the button they clicked
                Selection.set(interaction.user.id, interaction.customId);

                const descriptionInput = new TextInputBuilder()
                    .setCustomId('description')
                    .setLabel("Please describe your issue")
			        .setStyle(TextInputStyle.Paragraph);

                const descriptionRow = new ActionRowBuilder().addComponents(descriptionInput);

                modal.addComponents(descriptionRow);

                await interaction.showModal(modal);
            }
            return;
        }

        // Check if interaction is a modal
        if (interaction.isModalSubmit()) {
            if(interaction.customId === 'ticket') {
                const category = Selection.get(interaction.user.id);
                if(!category) return;
                // Get the description from the modal
                const description = interaction.fields.getField('description', ComponentType.TextInput);
                console.log(category, description);
                // Create the ticket with ticketmanager
                const ticket = await interaction.client.ticketManager.createTicket(interaction.guild, interaction.user, category, description.value);
                interaction.reply({ content: `Ticket created! [Click Here](${ticket.url})`, ephemeral: true });
            }
            return;
        }
    }   
}   