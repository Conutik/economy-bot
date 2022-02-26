const { Discord, Client, MessageEmbed, Intents, Collection, Permissions } = require('discord.js');
const fs = require('fs');

const bot = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS]
})


const { MongoClient } = require('mongodb');
const uri = "test";

bot.mongo = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

bot.mongo.connect().then(() => {
	console.log("Connected to Database")
})
	
//////////////////////////////////////////////
//              EVENT MANAGEMENT            //
//////////////////////////////////////////////


const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	console.log('Event' + ` | ` + event.name + ` has loaded.`)
	if (event.once) {
		bot.once(event.name, (...args) => event.run(...args, bot));
	} else {
		bot.on(event.name, (...args) => event.run(...args, bot));
	}
}

// [`aliases`, `commands`].forEach(x => bot[x] = new Collection());
// ['command'].forEach(x => require(`./handlers/${x}`)(bot));


bot.login("test")
