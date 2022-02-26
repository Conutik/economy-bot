const { MessageEmbed } = require("discord.js")

module.exports = {
    config: {
        name: 'balance',
        description: 'Get a user\'s balance.',
        options: [{
            name: 'user',
            type: 'USER',
            description: 'A user whose balance to fetch',
            required: false
        }],
    },
    run: async (bot, interaction, args) => {

        let result = bot.mongo.db("bot").collection(interaction.guild.id)

        let user = args.getUser('user') || interaction.user

        let data = await result.findOne({ _id: user.id })
        if(!data) {
            let embed = new MessageEmbed()
                .setColor("RANDOM")
                .setAuthor(`${user.tag}`, `${user.displayAvatarURL({ dynamic: true, size: 1024 })}`)
                .setDescription(`**__BALANCE:__** \`0\``)
            interaction.reply({ embeds: [embed] })
        } else {

            let bal = data.balance || 0;

            let embed = new MessageEmbed()
                .setColor("RANDOM")
                .setAuthor(`${user.tag}`, `${user.displayAvatarURL({ dynamic: true, size: 1024 })}`)
                .setTitle(`${user.username}'s Level`)
                .setDescription(`**__BALANCE:__** \`${bal}\``)
            interaction.reply({ embeds: [embed] })
        }

    }}