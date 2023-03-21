const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bite')
        .setDescription('bite someone!')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to bite')
                .setRequired(true)),
    async execute(interaction) {
        // Get the user to bite
        const user = interaction.options.getUser('user');

        // Get the image
        const res = await fetch('https://api.waifu.pics/sfw/bite');
        const bite = await res.json();
        
        // Create the embed
        const embed = new EmbedBuilder()
            .setTitle(`${interaction.client.config.botname} Fun`)
            .setDescription(`${interaction.user} bit ${user}!`)
            .setColor(0x00FF00)
            .setImage(bite.url)
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    },
};
