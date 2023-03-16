const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
import fetch from 'node-fetch';

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

        // Get the image
        const res = await fetch('https://api.waifu.pics/sfw/cuddle');
        const cuddle = await res.json();
        
        // Create the embed
        const embed = new EmbedBuilder()
            .setTitle('CCBot Fun')
            .setDescription(`${interaction.user} cuddled ${user}!`)
            .setColor(0x00FF00)
            .setImage(cuddle.url)
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    },
};
