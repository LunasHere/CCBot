const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Completely stops the music'),
    async execute(interaction) {
        // Check if the user is in a voice channel
        if (!interaction.member.voice.channel) {
            await interaction.reply({ content: 'You must be in a voice channel to use this command!', ephemeral: true });
            return;
        }
        // Check if the bot is in a voice channel
        if (interaction.client.voice.connections == interaction.member.voice.channel.id) {
            await interaction.reply({ content: 'You must be in the same voice channel as the bot to use this command!', ephemeral: true });
            return;
        }
        // Check if the queue is empty
        if (!interaction.client.player.getQueue(interaction.guild)) {
            await interaction.reply({ content: 'There is no song playing!', ephemeral: true });
            return;
        }
        // Stop the music
        interaction.client.player.getQueue(interaction.guild).destroy();
        // Create the embed
        const embed = new EmbedBuilder()
            .setTitle('CCBot Music')
            .setDescription('Stopped the music!')
            .setColor(0x00FF00)
            .setTimestamp();
        // Reply to the interaction
        await interaction.reply({ embeds: [embed] });
    },
};
