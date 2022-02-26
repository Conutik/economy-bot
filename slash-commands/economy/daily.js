const { MessageEmbed } = require('discord.js');
const ms = require('parse-ms');
const { green_light, red_light } = require('../../color.json');

const timeout = 86400000;
const amount = Math.floor((Math.random() * 1000) + 200);

module.exports = {
    config: {
        name: 'daily',
        description: 'Get a certain amount of money daily.'
    },
    run: async (bot, interaction, args) => {

        let result = bot.mongo.db("bot").collection(interaction.guild.id)


        // const lastCollected = economy.get(`daily.${message.guild.id}.${message.author.id}`);

        const lastCollected = await result.findOne({ _id: interaction.user.id })

        if (lastCollected && Date.now() - lastCollected.daily < timeout) {
            const time = ms(timeout - (Date.now() - lastCollected.daily));

            const timeEmbed = new MessageEmbed()
                .setColor(red_light)
                .setDescription(`:x: You've already collected your daily reward\n\nCollect it again in ${time.hours} hours ${time.minutes} minutes ${time.seconds} seconds`);

            interaction.reply({ embeds: [timeEmbed] })
        } else {
            const moneyEmbed = new MessageEmbed()
                .setColor(green_light)
                .setDescription(`:white_check_mark: You've collected your daily reward of ${amount} coins`);

            interaction.reply({ embeds: [moneyEmbed] })

            result.updateOne({ _id: interaction.user.id }, { $set: { daily: Date.now() }, $inc: { balance: amount } }, { upsert: true })
        }
    }
};