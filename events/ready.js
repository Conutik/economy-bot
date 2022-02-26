
const { Collection } = require('discord.js')

module.exports = {
	name: 'ready',
	once: true,
	run: async(bot) => {

		bot.interactions = new Collection()

		const interactionManager = require('../handlers/interaction.js');
		await interactionManager(bot)

		const contextManager = require('../handlers/context-menu.js');
		await contextManager(bot)

		let arrayOfSlash = bot.interactions.get('slash')
		let arrayOfContext = bot.interactions.get('context')
		let allInteractions = arrayOfSlash.concat(arrayOfContext)

		await bot.guilds.cache.get("725428229464129567")?.commands.set(allInteractions);
		// await bot.application.commands.set(allInteractions)

		console.log(`Ready! ${bot.user.tag}`)
		bot.user.setStatus('online');
		bot.user.setActivity(`EXAMPLE BOT`, { type: `WATCHING` });

	}}