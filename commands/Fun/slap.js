const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
import fetch from 'node-fetch';

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

        // Get the image
        const res = await fetch('https://api.waifu.pics/sfw/slap');
        const slap = await res.json();

        // Create the embed
        const embed = new EmbedBuilder()
            .setTitle('CCBot Fun')
            .setDescription(`${interaction.user} slapped ${user}!`)
            .setColor(0x00FF00)
            .setImage(slap.url)
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    }
};