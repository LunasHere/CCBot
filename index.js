const { REST, Routes, Client, EmbedBuilder, GatewayIntentBits, Collection, ActivityType } = require('discord.js');
const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent,
	GatewayIntentBits.GuildMembers,
] });
const fs = require('node:fs');
const config = require('./config.json');

const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const app = express();

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
client.commands = new Collection();

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

const rest = new REST({ version: '10' }).setToken(token);

client.on("ready", () => {
    console.log("Logged in as " + client.user.tag);
    client.user.setPresence({
        status: "online",
        activities: [{
            name: "your feelings <3",
            type: ActivityType.Listening
        }]
    });
});

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationCommands(config.clientid),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    // commands are stored in an array, so we can use the array.find() method to find the command that matches the name
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});


client.login(token);

app.listen(config.port, function() {
    console.log("Server started on port " + config.port);
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.post('/suggest',(request,response) => {
    if(request.body.secret != config.secret) {
        response.status(401).send("Invalid secret");
        return;
    }
    const channel = client.channels.cache.get(config.channelid);

    const embed = new EmbedBuilder()
        .setTitle("Suggestion")
        .setDescription("*This suggestion was created in-game with the /suggest command.*")
        .addFields(
            { name: "Suggestion", value: request.body.suggestion },
            { name: "Author", value: request.body.username },
        )
        .setColor(0x00FF00)
        .setTimestamp();
    
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
    response.send("OK");
});

app.use("/", router);