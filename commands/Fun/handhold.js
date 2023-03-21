const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('handhold')
        .setDescription('handhold someone!')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to handhold')
                .setRequired(true)),
    async execute(interaction) {
        // Get the user to handhold
        const user = interaction.options.getUser('user');

        // Get the image
        const res = await fetch('https://api.waifu.pics/sfw/handhold');
        const handhold = await res.json();
        
        // Create the embed
        const embed = new EmbedBuilder()
            .setTitle(`${interaction.client.config.botname} Fun`)
            .setDescription(`${interaction.user} held ${user}'s hand!`)
            .setColor(0x00FF00)
            .setImage(handhold.url)
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    },
};
