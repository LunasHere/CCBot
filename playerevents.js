const { EmbedBuilder } = require("discord.js");

module.exports.registerPlayerEvents = function (client) {
    // Track start event
    client.player.on("trackStart", (queue, track) => {
        const embed = new EmbedBuilder()
            .setTitle("CCBot Music")
            .setDescription(`🎶 | Now playing **[${track.title}](${track.url})**!`)
            .setColor(0x00FF00)
            .setTimestamp();
        queue.metadata.channel.send({ embeds: [embed] });
    });
    // Channel empty event
    client.player.on("channelEmpty", (queue) => {
        const embed = new EmbedBuilder()
            .setTitle("CCBot Music")
            .setDescription("🎶 | No one is in the voice channel, leaving the channel.")
            .setColor(0x00FF00)
            .setTimestamp();
        queue.metadata.channel.send({ embeds: [embed] });
    });
    // Queue end event
    client.player.on("queueEnd", (queue) => {
        const embed = new EmbedBuilder()
            .setTitle("CCBot Music")
            .setDescription("🎶 | Queue ended.")
            .setColor(0x00FF00)
            .setTimestamp();
        queue.metadata.channel.send({ embeds: [embed] });
    });
}
