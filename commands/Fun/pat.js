const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const AnimeImages = require('anime-images-api');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pat')
        .setDescription('Pat someone!')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to pat')
                .setRequired(true)),
    async execute(interaction) {
        // Get the user to pat
        const user = interaction.options.getUser('user');

        const api = new AnimeImages();
        const pat = await api.sfw.pat();

        // Create the embed
        const embed = new EmbedBuilder()
            .setTitle('CCBot Fun')
            .setDescription(`${interaction.user} patted ${user}!`)
            .setColor(0x00FF00)
            .setImage(pat.image)
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    },
};