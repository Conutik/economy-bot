const { MessageEmbed } = require("discord.js")

module.exports = {
    config: {
        name: 'set',
        description: 'Set a user\'s balance.',
        options: [{
            name: 'user',
            type: 'USER',
            description: 'A user whose avatar to fetch.',
            required: true
        }, {
            name; 'balance',
            type: 'INTEGER',
            description: 'The new balance',
            required: true
        }],
    },
    run: async (bot, interaction, args) => {

        let result = bot.mongo.db("bot").collection(interaction.guild.id)

        let user = args.getUser('user');
        let bal = args.getInteger('balance');

        let data = await result.findOne({ _id: user.id })

        result.updateOne({ _id: user.id }, { $set: { balance: bal } }, { upsert: true })

        interaction.reply(`Done!`)


    }}
