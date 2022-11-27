const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skips the current song'),
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
        // Skip the song
        interaction.client.player.getQueue(interaction.guild).skip();
        const embed = new EmbedBuilder()
            .setTitle('CCBot Music')
            .setDescription('Skipped the current song!')
            .setColor(0x00FF00)
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    },
};