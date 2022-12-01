const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const AnimeImages = require('anime-images-api');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kiss')
        .setDescription('Kiss someone!')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to kiss')
                .setRequired(true)),
    async execute(interaction) {
        // Get the user to kiss
        const user = interaction.options.getUser('user');

        const api = new AnimeImages();
        const kiss = await api.sfw.kiss();

        // Create the embed
        const embed = new EmbedBuilder()
            .setTitle('CCBot Fun')
            .setDescription(`${interaction.user} kissed ${user}!`)
            .setColor(0x00FF00)
            .setImage(kiss.image)
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    }
};