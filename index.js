const { REST, Routes, Client, EmbedBuilder, GatewayIntentBits, Collection, ActivityType } = require('discord.js');
const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent,
	GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
] });
const fs = require('node:fs');
const config = require('./config.json');
const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const app = express();
const { Player } = require("discord-player")

// Register the commands
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
client.commands = new Collection();

// Load the commands
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
	// Ensure the command has the correct properties
	if ('data' in command && 'execute' in command) {
        // Register the command
		client.commands.set(command.data.name, command);
	} else {
        // Log the error
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

// Create a new Discord REST instance
const rest = new REST({ version: '10' }).setToken(config.token);

// Set up player
client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25,
    },
});

// Track start event
client.player.on("trackStart", (queue, track) => {
    const embed = new EmbedBuilder()
        .setTitle("CCBot Music")
        .setDescription(`🎶 | Now playing **[${track.title}](${track.url})**!`)
        .setColor(0x00FF00)
        .setTimestamp();
    queue.metadata.channel.send({ embeds: [embed] });
});
// Channel empty event
client.player.on("channelEmpty", (queue) => {
    const embed = new EmbedBuilder()
        .setTitle("CCBot Music")
        .setDescription("🎶 | No one is in the voice channel, leaving the channel.")
        .setColor(0x00FF00)
        .setTimestamp();
    queue.metadata.channel.send({ embeds: [embed] });
});
// Queue end event
client.player.on("queueEnd", (queue) => {
    const embed = new EmbedBuilder()
        .setTitle("CCBot Music")
        .setDescription("🎶 | Queue ended.")
        .setColor(0x00FF00)
        .setTimestamp();
    queue.metadata.channel.send({ embeds: [embed] });
});

// Discord ready event
client.on("ready", () => {
    // Shows the bot is online
    console.log("Logged in as " + client.user.tag);
    // Set the bot status
    client.user.setPresence({
        status: "online",
        activities: [{
            name: "your feelings <3",
            type: ActivityType.Listening
        }]
    });
});

// Register the commands
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // Send the commands to the Discord API
		const data = await rest.put(
			Routes.applicationCommands(config.clientid),
			{ body: commands },
		);
        
		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
        // Log the error
		console.error(error);
	}
})();

// Interaction handler
client.on('interactionCreate', async interaction => {
    // Check if the interaction is a command
    if (!interaction.isCommand()) return;

    // Obtain the command
    const command = interaction.client.commands.get(interaction.commandName);

    // Check if the command exists
    if (!command) return;

    try {
        // Execute the command
        await command.execute(interaction);
    } catch (error) {
        // Log the error and reply to the user
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

// Login to Discord
client.login(config.token);

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// register /suggest route
router.post('/suggest',(request,response) => {
    // Check if the secret is correct
    if(request.body.secret != config.secret) {
        // Secret is incorrect, return 401
        response.status(401).send("Invalid secret");
        return;
    }

    // Get the suggestion channel
    const channel = client.channels.cache.get(config.channelid);

    // Create the embed
    const embed = new EmbedBuilder()
        .setTitle("Suggestion")
        .setDescription("*This suggestion was created in-game with the /suggest command.*")
        .addFields(
            { name: "Suggestion", value: request.body.suggestion },
            { name: "Author", value: request.body.username },
        )
        .setColor(0x00FF00)
        .setTimestamp();
    
    // Create the thread
    channel.threads.create({
        name: "Suggestion by " + request.body.username,
        autoArchiveDuration: 1440,
        reason: "Suggestion by " + request.body.username,
        type: "GUILD_PUBLIC_THREAD",
        message: {
            embeds: [embed],
        }
    }).then(thread => console.log("New suggestion created: " + thread.id))
    .catch(console.error);
    // Send the response
    response.send("OK");
});

// register the route
app.use("/", router);

// Start the server
app.listen(config.port, function() {
    console.log("Server started on port " + config.port);
});