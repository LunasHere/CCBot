const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return;
        if (message.channel.type === 'DM') return;
        // Get the level of the user
        const level = await message.client.levelingManager.getLevel(message.author);

        const cooldown = await message.client.cooldownManager.getCooldown('addXP', message.author);
        if (cooldown > Date.now()) return;
        // Add XP to the user
        await message.client.levelingManager.addXP(message.author, 2);
        // Add cooldown to the user of 1 minute
        await message.client.cooldownManager.addCooldown('addXP', message.author, 60000);
        // Check if the user has leveled up
        const newLevel = await message.client.levelingManager.getLevel(message.author);
        if (newLevel > level) {
            const embed = new EmbedBuilder()
                .setTitle('Level Up!')
                .setDescription(`📊 | **${message.author.username}** has leveled up to **Level ${newLevel}**!`)
                .setColor(0x00FF00)
                .setTimestamp();
            message.channel.send({ embeds: [embed] });
        }
    }
}

        