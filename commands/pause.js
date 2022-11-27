const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pauses the current song'),
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
        // Check if the song is already paused
        if (interaction.client.player.getQueue(interaction.guild).paused) {
            await interaction.reply({ content: 'The song is already paused!', ephemeral: true });
            return;
        }
        // Pause the song
        interaction.client.player.getQueue(interaction.guild).setPaused(true);
        const embed = new EmbedBuilder()
            .setTitle('CCBot Music')
            .setDescription('Paused the current song!')
            .setColor(0x00FF00)
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    },
};