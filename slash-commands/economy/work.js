const { MessageEmbed } = require('discord.js');
const { shuffle } = require("../../functions.js");
const randomWords = require('random-words');
const ms = require('parse-ms');
const { red_light, green_light } = require('../../color.json')

const timedefault = 60 * 60 * 500;

module.exports = {
    config: {
        name: 'work',
        description: 'Work to get money',
    },
    run: async (bot, interaction, args) => {

        let result = bot.mongo.db("bot").collection(interaction.guild.id)

        let lastWorked = await result.findOne({ _id: interaction.user.id })

        console.log(lastWorked)

        let rank = lastWorked.rank || 1
        let timeout = timedefault / rank

        if (lastWorked && Date.now() - lastWorked.work < timeout) {
            const time = ms(timeout - (Date.now() - lastWorked.work));

            const timeEmbed = new MessageEmbed()
                .setColor(red_light)
                .setDescription(`:x: You've already worked recently\n\nWork again in ${time.minutes}m ${time.seconds}s`);

            return interaction.channel.send({ embeds: [timeEmbed] });
        }

        let word = randomWords()
        console.log(word)
        let shuffled = shuffle(word.split(''))
        let joinedShuffled = shuffled.join('')

        interaction.channel.send(`Task: Unscramble the word: ${joinedShuffled}`)

        const filter = m => m.author.id === interaction.user.id;
        const collector = interaction.channel.createMessageCollector({ filter, max: 1, time: 15000 });

        collector.on('collect', m => {
            let answerLower = m.content.toLowerCase()
            if(answerLower == word) {

                result.updateOne({ _id: interaction.user.id }, { $set: { work: Date.now() }, $inc: { workAmount: 1 } }, { upsert: true })

                let ranksend = lastWorked.rank || 1
                let rankfinal = ranksend / 5

                let workAmount = lastWorked.workAmount || 1

                if(workAmount <= 1) {
                    result.updateOne({ _id: interaction.user.id }, { $set: { workAmount: 1 }}, { upsert: true })
                    workAmount = 1
                }

                let amount = (workAmount+1)*250
                amount = amount * rankfinal
                if(amount < 0) { amount = 0 }
                console.log(amount)
                result.updateOne({ _id: interaction.user.id }, { $inc: { balance: amount } }, { upsert: true })


                let embed = new MessageEmbed()
                    .setColor(green_light)
                    .setTitle('Success')
                    .setAuthor(bot.user.username, bot.user.displayAvatarURL())
                    .setDescription(`Your boss is proud of you and gave you ${amount} dollars!`)
                interaction.channel.send({ embeds: [embed] });
            } else {
                result.updateOne({ _id: interaction.user.id }, { $set: { work: Date.now() }, $inc: { workAmount: -1 } }, { upsert: true })
                let workAmount = lastWorked.workAmount-1 || 1
                if(workAmount <= 1) {
                    result.updateOne({ _id: interaction.user.id }, { $set: { workAmount: 1 }}, { upsert: true })
                    workAmount = 1
                }
                let badpay = workAmount * 250 / 5
                if(badpay < 0) { badpay = 0 }
                let failEmbed = new MessageEmbed()
                    .setColor(red_light)
                    .setAuthor(bot.user.username, bot.user.displayAvatarURL())
                    .setDescription(`Your boss is mad at you and gave you ${badpay} dollars!`)
                interaction.channel.send({ embeds: [failEmbed] });
                return;
            }
        });

        collector.on('end', collected => {
            if(!collected.size > 0) {
                interaction.channel.send(`You Have ran out of time the word was ${word}`);
                result.updateOne({ _id: interaction.user.id }, { $set: { work: Date.now() }, $inc: { workAmount: -1 } }, { upsert: true })
                let workAmount = lastWorked.workAmount-1 || 1
                if(workAmount <= 1) {
                    result.updateOne({ _id: interaction.user.id }, { $set: { workAmount: 1 }}, { upsert: true })
                }
                return;
            }

        })

    }
}


