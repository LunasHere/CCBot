const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { QueryType } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song')
        .addStringOption(option =>
            option
                .setName('song')
                .setDescription('The song you want to play')
                .setRequired(false)),
    async execute(interaction) {
        // Get the song
        const songname = interaction.options.getString('song');

        const queue = await interaction.client.player.createQueue(interaction.guild);
		if (!queue.connection) await queue.connect(interaction.member.voice.channel);

        // check if songname is empty or undefined
        if (!songname) {
            // check if user is in a voice channel
            if (!interaction.member.voice.channel) {
                await interaction.reply({ content: 'You must be in a voice channel to use this command!', ephemeral: true });
                return;
            }
            // check if the bot is in a voice channel
            if (interaction.client.voice.connections == interaction.member.voice.channel.id) {
                await interaction.reply({ content: 'You must be in the same voice channel as the bot to use this command!', ephemeral: true });
                return;
            }
            
            interaction.client.player.getQueue(interaction.guild).setPaused(false);
            const embed = new EmbedBuilder()
                .setTitle('CCBot Music')
                .setDescription('Unpaused the current song!')
                .setColor(0x00FF00)
                .setTimestamp();
            await interaction.reply({ embeds: [embed] });
            return;
        }

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
        // Check if song is a youtube watch url
        if (songname.match(/^https?:\/\/(www.youtube.com|youtube.com)\/watch(.*)$/)) {
            const result = await interaction.client.player.search(songname, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            });
            if (!result || !result.tracks.length) {
                await interaction.reply({ content: 'No results were found!', ephemeral: true });
                return;
            }
            const song = result.tracks[0];
            await queue.addTrack(song);
            const embed = new EmbedBuilder()
                .setTitle('CCBot Music')
                .setDescription(`Added ${song.title} to the queue!`)
                .setColor(0x00FF00)
                .setTimestamp();
            await interaction.reply({ embeds: [embed] });
        // check if song is a youtube playlist url
        } else if (songname.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
            const result = await interaction.client.player.playlist(songname, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            });
            if (!result || !result.tracks.length) {
                await interaction.reply({ content: 'No results were found!', ephemeral: true });
                return;
            }
            await queue.addTracks(result.tracks);
            const embed = new EmbedBuilder()
                .setTitle('CCBot Music')
                .setDescription(`${result.tracks.length} songs from playlist ${playlist.title} have been added to the Queue`)
                
                .setColor(0x00FF00)
                .setTimestamp();
            await interaction.reply({ embeds: [embed] });
        } else {
            // Search for the song
            const result = await interaction.client.player.search(songname, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            });
            if (!result || !result.tracks.length) {
                await interaction.reply({ content: 'No results were found!', ephemeral: true });
                return;
            }
            const song = result.tracks[0];
            await queue.addTrack(song);
            const embed = new EmbedBuilder()
                .setTitle('CCBot Music')
                .setDescription(`Added ${song.title} to the queue!`)
                .setColor(0x00FF00)
                .setTimestamp();
            await interaction.reply({ embeds: [embed] });
        }
        if (!queue.playing) await queue.play();
    },
};
