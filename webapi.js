const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const app = express();
const config = require("./config.json");
const { EmbedBuilder } = require("discord.js");

module.exports.registerWebAPI = function (client) {
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
        const channel = client.channels.cache.get(config.suggestionchannelid);

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

    app.use(express.static('public'));
}