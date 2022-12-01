const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rps')
        .setDescription('Play rock paper scissors!')
        .addStringOption(option =>
            option.setName('choice')
                .setDescription('The choice to play')
                .setRequired(true)
                .addChoices({
                    name: 'Rock',
                    value: 'rock'
                }, 
                {
                    name: 'Paper',
                    value: 'paper'
                }, 
                {
                    name: 'Scissors',
                    value: 'scissors'
                })),
                
    async execute(interaction) {
        // Get the choice
        const choice = interaction.options.getString('choice');

        // Get the bot's choice
        const botChoice = Math.floor(Math.random() * 3);
        let text, botChoiceString;
        switch(choice) {
            case 'rock':
                if (botChoice === 0) {
                    // Tie
                    text = 'We tied!';
                    botChoiceString = 'rock';
                } else if (botChoice === 1) {
                    // Lose
                    text = 'I won!';
                    botChoiceString = 'paper';
                } else {
                    // Win
                    text = 'You won!';
                    botChoiceString = 'scissors';
                }
                break;
            case 'paper':
                if (botChoice === 0) {
                    // Win
                    text = 'You won!';
                    botChoiceString = 'rock';
                } else if (botChoice === 1) {
                    // Tie
                    text = 'We tied!';
                    botChoiceString = 'paper';
                } else {
                    // Lose
                    text = 'I won!';
                    botChoiceString = 'scissors';
                }
                break;
            case 'scissors':
                if (botChoice === 0) {
                    // Lose
                    text = 'I won!';
                    botChoiceString = 'rock';
                } else if (botChoice === 1) {
                    // Win
                    text = 'You won!';
                    botChoiceString = 'paper';
                } else {
                    // Tie
                    text = 'We tied!';
                    botChoiceString = 'scissors';
                }
                break;
        }
                    
        // Create the embed
        const embed = new EmbedBuilder()
            .setTitle('CCBot Games')
            .setDescription(`You chose ${choice}, I chose ${botChoiceString}!\n\n${text}`)
            .setColor(0x00FF00)
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    },
};