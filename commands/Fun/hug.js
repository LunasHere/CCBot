const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');


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

        // Get the image
        const res = await fetch('https://api.waifu.pics/sfw/hug');
        const hug = await res.json();

        // Create the embed
        const embed = new EmbedBuilder()
            .setTitle('CCBot Fun')
            .setDescription(`${interaction.user} hugged ${user}!`)
            .setColor(0x00FF00)
            .setImage(hug.url)
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    },
};