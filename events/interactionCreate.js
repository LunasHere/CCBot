const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        // Check if the interaction is a command
        if (!interaction.isCommand()) return;

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
    }
}