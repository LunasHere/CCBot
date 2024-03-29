const { REST, Routes, Client, EmbedBuilder, GatewayIntentBits, Collection, ActivityType } = require('discord.js');
const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent,
	GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessageReactions,
] });
const fs = require('node:fs');
const config = require('./config.json');
const { Player } = require("discord-player")
const { GiveawaysManager } = require('discord-giveaways');
const { registerPlayerEvents } = require('./playerevents.js');
const { registerWebAPI } = require('./webapi.js');
registerWebAPI(client);

// Create mycon connection
const mycon = require('mysql2');
const con = mycon.createConnection({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
});
// Connect to mycon
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to Mysql database!");
});
// Create giveaway table if not exists
con.query(
    `
	CREATE TABLE IF NOT EXISTS \`giveaways\`
	(
		\`id\` INT(1) NOT NULL AUTO_INCREMENT,
		\`message_id\` VARCHAR(20) NOT NULL,
		\`data\` JSON NOT NULL,
		PRIMARY KEY (\`id\`)
	);
`,
    (err) => {
        if (err) console.error(err);
        console.log('[SQL] Created table `giveaways`');
    }
);

client.con = con;

client.config = config;

// Register the commands
const commands = [];
client.commands = new Collection();

const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders) {
    const commandFiles = fs
        .readdirSync(`./commands/${folder}`)
        .filter((file) => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
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
}
// Register the events in the events folder
const eventFiles = fs
    .readdirSync('./events')
    .filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}
// Set up player
client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25,
    },
});
// Register the player events
registerPlayerEvents(client);

// Create a new Discord REST instance
const rest = new REST({ version: '10' }).setToken(config.token);

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

// Login to Discord
client.login(config.token);

// Setup giveaway manager
const GiveawayManagerWithOwnDatabase = class extends GiveawaysManager {
    // This function is called when the manager needs to get all giveaways which are stored in the database.
    async getAllGiveaways() {
        return new Promise((resolve, reject) => {
            con.query('SELECT `data` FROM `giveaways`', (err, res) => {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                const giveaways = res.map((row) =>
                    JSON.parse(row.data, (_, v) =>
                        typeof v === 'string' && /BigInt\("(-?\d+)"\)/.test(v) ? eval(v) : v
                    )
                );
                resolve(giveaways);
            });
        });
    }

    // This function is called when a giveaway needs to be saved in the database.
    async saveGiveaway(messageId, giveawayData) {
        return new Promise((resolve, reject) => {
            con.query(
                'INSERT INTO `giveaways` (`message_id`, `data`) VALUES (?,?)',
                [messageId, JSON.stringify(giveawayData, (_, v) => (typeof v === 'bigint' ? `BigInt("${v}")` : v))],
                (err, res) => {
                    if (err) {
                        console.error(err);
                        return reject(err);
                    }
                    resolve(true);
                }
            );
        });
    }

    // This function is called when a giveaway needs to be edited in the database.
    async editGiveaway(messageId, giveawayData) {
        return new Promise((resolve, reject) => {
            con.query(
                'UPDATE `giveaways` SET `data` = ? WHERE `message_id` = ?',
                [JSON.stringify(giveawayData, (_, v) => (typeof v === 'bigint' ? `BigInt("${v}")` : v)), messageId],
                (err, res) => {
                    if (err) {
                        console.error(err);
                        return reject(err);
                    }
                    resolve(true);
                }
            );
        });
    }

    // This function is called when a giveaway needs to be deleted from the database.
    async deleteGiveaway(messageId) {
        return new Promise((resolve, reject) => {
            con.query('DELETE FROM `giveaways` WHERE `message_id` = ?', messageId, (err, res) => {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                resolve(true);
            });
        });
    }
};

// Create a new instance of your new class
const manager = new GiveawayManagerWithOwnDatabase(client, {
    default: {
        botsCanWin: false,
        embedColor: '#FF0000',
        embedColorEnd: '#000000',
        reaction: '🎉'
    }
});
// We now have a giveawaysManager property to access the manager everywhere!
client.giveawayManager = manager;

const EconomyManager = require('./managers/economymanager.js');
const economy = new EconomyManager(client);
client.economyManager = economy;

const CooldownManager = require('./managers/cooldownmanager.js');
const cooldown = new CooldownManager(client);
client.cooldownManager = cooldown;

const LevelingManager = require('./managers/levelingmanager.js');
const leveling = new LevelingManager(client);
client.levelingManager = leveling;

const WarnManager = require('./managers/warnmanager.js');
const warning = new WarnManager(client);
client.warnManager = warning;

const TicketManager = require('./managers/ticketmanager.js');
const ticket = new TicketManager(client);
client.ticketManager = ticket;