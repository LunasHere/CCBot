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

        // Create the queue
        const queue = await interaction.client.player.createQueue(interaction.guild);
		if (!queue.connection) await queue.connect(interaction.member.voice.channel);


        // Check if there is metadata
        if (!queue.metadata) {
            // Set the metadata
            queue.metadata = {
                'channel': interaction.channel,
                'user': interaction.user,
                'isPlaying': true
            }
        }

        // Check if songname is empty or undefined
        if (!songname) {
            if(queue.metadata.isPlaying) {
                return interaction.reply({ content: 'There is already a song playing!', ephemeral: true });
            }
            // Resume the song
            interaction.client.player.getQueue(interaction.guild).setPaused(false);
            interaction.client.player.getQueue(interaction.guild).metadata.isPlaying = true;
            const embed = new EmbedBuilder()
                .setTitle('CCBot Music')
                .setDescription('Unpaused the current song!')
                .setColor(0x00FF00)
                .setTimestamp();
            return await interaction.reply({ embeds: [embed] });
        }

        // Check if song is a youtube watch url
        if (songname.match(/^.*(youtu.be\/|list=)([^#\&\?]*).*/)) {
            const result = await interaction.client.player.search(songname, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            });
            if (!result || !result.tracks.length) {
                await interaction.reply({ content: 'No results were found!', ephemeral: true });
                return;
            }
            const playlist = result.playlist;
            await queue.addTracks(result.tracks);
            const embed = new EmbedBuilder()
                .setTitle('CCBot Music')
                .setDescription(`${result.tracks.length} songs from playlist [${playlist.title}](${playlist.url}) have been added to the Queue`)
                .setColor(0x00FF00)
                .setTimestamp();
            await interaction.reply({ embeds: [embed] });
        // check if song is a playlist url
        } else if (songname.match(/^https?:\/\/(www.youtube.com|youtube.com)\/watch(.*)$/)) {
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
                .setDescription(`Added [${song.title}](${song.url}) to the queue!`)
                .setColor(0x00FF00)
                .setTimestamp();
            await interaction.reply({ embeds: [embed] });
        // Search for song
        } else {
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
                .setDescription(`Added [${song.title}](${song.url}) to the queue!`)
                .setColor(0x00FF00)
                .setTimestamp();
            await interaction.reply({ embeds: [embed] });
        }
        if (!queue.playing) await queue.play();
    },
};
