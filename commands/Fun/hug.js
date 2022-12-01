const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const AnimeImages = require('anime-images-api');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hug')
        .setDescription('Hug someone!')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to hug')
                .setRequired(true)),
    async execute(interaction) {
        // Get the user to hug
        const user = interaction.options.getUser('user');

        const api = new AnimeImages();
        const hug = await api.sfw.hug();

        // Create the embed
        const embed = new EmbedBuilder()
            .setTitle('CCBot Fun')
            .setDescription(`${interaction.user} hugged ${user}!`)
            .setColor(0x00FF00)
            .setImage(hug.image)
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    },
};