const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');


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

        // Get the image
        const res = await fetch('https://api.waifu.pics/sfw/pat');
        const pat = await res.json();

        // Create the embed
        const embed = new EmbedBuilder()
            .setTitle('CCBot Fun')
            .setDescription(`${interaction.user} patted ${user}!`)
            .setColor(0x00FF00)
            .setImage(pat.url)
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    },
};