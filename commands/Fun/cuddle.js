const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const AnimeImages = require('anime-images-api');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cuddle')
        .setDescription('Cuddle someone!')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to cuddle')
                .setRequired(true)),
    async execute(interaction) {
        // Get the user to cuddle
        const user = interaction.options.getUser('user');

        const api = new AnimeImages();
        const cuddle = await api.sfw.cuddle();

        // Create the embed
        const embed = new EmbedBuilder()
            .setTitle('CCBot Fun')
            .setDescription(`${interaction.user} cuddled ${user}!`)
            .setColor(0x00FF00)
            .setImage(cuddle.image)
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    },
};
