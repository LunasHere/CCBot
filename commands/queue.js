const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Shows the current queue')
        .addNumberOption(option =>
            option
                .setName('page')
                .setDescription('The page you want to see')
                .setMinValue(1)
                .setRequired(true)),
    async execute(interaction) {
        // Get the queue
        const queue = interaction.client.player.getQueue(interaction.guildId)
        if (!queue || !queue.playing){
            return await interaction.reply({ content: "There are no songs in the queue", ephemeral: true })
        }

        // Get the total pages
        const totalPages = Math.ceil(queue.tracks.length / 10) || 1
        const page = (interaction.options.getNumber("page") || 1) - 1

        // Check if the page is valid
        if (page > totalPages) 
            return await interaction.editReply({ content: `Invalid Page. There are only a total of ${totalPages} pages of songs`, ephemeral: true })
        
        // Get the songs
        const queueString = queue.tracks.slice(page * 10, page * 10 + 10).map((song, i) => {
            return `**${page * 10 + i + 1}.** \`[${song.duration}]\` ${song.title} -- <@${song.requestedBy.id}>`
        }).join("\n");

        // Get current song
        const currentSong = queue.current;

        // Create the embed
        const embed = new EmbedBuilder()
            .setTitle("Queue")
            .setDescription(`**Current Song:** \`[${currentSong.duration}]\` ${currentSong.title} -- <@${currentSong.requestedBy.id}>\n\n${queueString}`)
            .setColor(0x00FF00)
            .setTimestamp()
            .setFooter({ text: `Page ${page + 1} of ${totalPages}` })
        await interaction.reply({ embeds: [embed] })
    }
}
