const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bonk')
        .setDescription('Bonk someone!')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to bonk')
                .setRequired(true)),
    async execute(interaction) {
        // Get the user to bonk
        const user = interaction.options.getUser('user');

        // Get the image
        const res = await fetch('https://api.waifu.pics/sfw/bonk');
        const bonk = await res.json();
        
        // Create the embed
        const embed = new EmbedBuilder()
            .setTitle(`${interaction.client.config.botname} Fun`)
            .setDescription(`${interaction.user} bonked ${user}!`)
            .setColor(0x00FF00)
            .setImage(bonk.url)
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    },
};
