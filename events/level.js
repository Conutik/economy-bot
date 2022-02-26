const { MessageEmbed } = require("discord.js");
module.exports = {
    name: 'messageCreate',
    once: false,
    run: async(message, bot) => {
        let collection = bot.mongo.db("bot").collection(message.guild.id)

        if(!message.content.startsWith('!')) {
            if(collection.findOne({ _id: message.author.id }) || collection.findOne({ _id: message.author.id }).time <= Date.now()) {
                await collection.updateOne({_id: message.author.id}, {
                    $inc: {points: 1, balance: 1},
                    $set: {time: Date.now() + 3600}
                }, {upsert: true})
                let user = collection.findOne({_id: message.author.id})
                let points = user.points;
                let rank = user.rank || 0;
                let check = 100 + (rank * 50);

                if(!user.rank) collection.updateOne({ _id: message.author.id }, { $set: { rank: 0 } }, { upsert: true})

                if (points >= check) {
                    await collection.updateOne({_id: message.author.id}, {$inc: {rank: 1, balance: 100}}, {upsert: true})
                    let rankEmbed = new MessageEmbed()
                        .setColor("GREEN")
                        .setTitle('Level Up')
                        .setDescription(`${message.author} has just leveled up to level ${rank + 1} Congrats!`)
                    message.channel.send({embeds: rankEmbed})
                }
            }
        }

        // if(!message.content.startsWith(prefix)) {
        //     const levels = new db.table('level')
        //     levels.add(`points.${message.guild.id}.${message.author.id}`, 1)
        //     let points = levels.get(`points.${message.guild.id}.${message.author.id}`)
        //     let rank = levels.get(`rank.${message.guild.id}.${message.author.id}`)
        //     if(!rank) {
        //         levels.set(`rank.${message.guild.id}.${message.author.id}`, 1)
        //     }
        //     let check = rank * 25
        //     if(points >= check) {
        //         levels.add(`rank.${message.guild.id}.${message.author.id}`, 1)
        //         let ranksend = levels.get(`rank.${message.guild.id}.${message.author.id}`)
        //         let rankEmbed = new MessageEmbed()
        //             .setColor(green_light)
        //             .setTitle('Level Up')
        //             .setDescription(`${message.author} has just leveled up to level ${ranksend} Congrats!`)
        //         if(message.channel.id !== "739473833853190184") {
        //             message.channel.send(rankEmbed)
        //         }
        //
        //     }
        // }
    }
}