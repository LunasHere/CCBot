const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skipto')
        .setDescription('Skips to a song in the queue')
        .addIntegerOption(option =>
            option
                .setName('song')
                .setDescription('The song you want to skip to')
                .setRequired(true)),
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
        // Check if a song is in the queue
        if (interaction.client.player.getQueue(interaction.guild).tracks.length < interaction.options.getInteger('song')-1) {
            await interaction.reply({ content: 'Theres not that many songs in the queue!', ephemeral: true });
            return;
        }
        // Create the embed
        const embed = new EmbedBuilder()
            .setTitle('CCBot Music')
            .setDescription(`Skipped to song [${interaction.client.player.getQueue(interaction.guild).tracks[interaction.options.getInteger('song')-1].title}!](${interaction.client.player.getQueue(interaction.guild).tracks[interaction.options.getInteger('song')-1].url})`)
            .setColor(0x00FF00)
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });

        interaction.client.player.getQueue(interaction.guild).skipTo(interaction.options.getInteger('song')-1);
    },
};