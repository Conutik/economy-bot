const { readdirSync } = require('fs');
const { Collection } = require('discord.js');

module.exports = async(bot) => {
    bot.contextmenus = new Collection()
    let commandArray = []
    const load = dirs => {
        const commands = readdirSync(`./context-menus/${dirs}/`).filter(d => d.endsWith(`.js`));
        for(let file of commands) {
            let pull = require(`../context-menus/${dirs}/${file}`);

            let contextCommand = {
                name: pull.config.name,
                type: pull.config.type
            }

            bot.contextmenus.set(pull.config.name, pull);
            commandArray.push(contextCommand)
            console.log('Context Menu' + ` | ` + pull.config.name + ` has loaded.`)
        }
    };
    ['utility'].forEach(x => load(x));
    bot.interactions.set('context', commandArray)
}
