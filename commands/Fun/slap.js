const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const AnimeImages = require('anime-images-api');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slap')
        .setDescription('Slap someone!')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to slap')
                .setRequired(true)),
    async execute(interaction) {
        // Get the user to slap
        const user = interaction.options.getUser('user');

        const api = new AnimeImages();
        const slap = await api.sfw.slap();

        // Create the embed
        const embed = new EmbedBuilder()
            .setTitle('CCBot Fun')
            .setDescription(`${interaction.user} slapped ${user}!`)
            .setColor(0x00FF00)
            .setImage(slap.image)
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    }
};