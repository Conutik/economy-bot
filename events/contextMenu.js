module.exports = {
	name: 'interactionCreate',
	once: false,
	run: async (interaction, bot) => {

        if(!interaction.isContextMenu()) return;
        if (!bot.contextmenus.has(interaction.commandName)) return;

		try {
            bot.contextmenus.get(interaction.commandName).run(bot, interaction, interaction.options);
        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'There was an error trying to execute that command!' });
        }
}}