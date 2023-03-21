const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffles the queue'),
    async execute(interaction) {
        // Get the queue
        const queue = interaction.client.player.getQueue(interaction.guildId)
        if (!queue || !queue.playing){
            return await interaction.reply({ content: "There are no songs in the queue", ephemeral: true })
        }

        // Shuffle the queue
        queue.shuffle();

        // Create the embed
        const embed = new EmbedBuilder()
            .setTitle(`${interaction.client.config.botname} Music`)
            .setDescription("🔀 | Queue shuffled.")
            .setColor(0x00FF00)
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    }
}
