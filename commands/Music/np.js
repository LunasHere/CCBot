const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('np')
        .setDescription('Shows the current song'),
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
        // Get the current song
        const song = interaction.client.player.getQueue(interaction.guildId).current

        // Create the bar
        const bar = interaction.client.player.getQueue(interaction.guild).createProgressBar({
            timecodes: true,
            queue: false,
            length: 19,
        });
        // Create the embed
        const embed = new EmbedBuilder()
            .setTitle(`${interaction.client.config.botname} Music`)
            .setDescription(`Now playing: [${song.title}](${song.url})\n\n${bar}`)
            .setColor(0x00FF00)
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    },
};
