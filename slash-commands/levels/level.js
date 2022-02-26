const { MessageEmbed } = require("discord.js")

module.exports = {
    config: {
        name: 'level',
        description: 'Get a user\'s level.',
        options: [{
            name: 'user',
            type: 'USER',
            description: 'A user whose avatar to fetch.',
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
                .setTitle(`${user.username}'s Level`)
                .setDescription(`**__LEVEL:__** \`0\` \n**__XP:__** \`0/100\``)
            interaction.reply({ embeds: [embed] })
        } else {
            let rank = data.rank || 0;
            let neededXP = 100 + (rank * 50);
            console.log(data)
            let embed = new MessageEmbed()
                .setColor("RANDOM")
                .setAuthor(`${user.tag}`, `${user.displayAvatarURL({ dynamic: true, size: 1024 })}`)
                .setTitle(`${user.username}'s Level`)
                .setDescription(`**__LEVEL:__** \`${rank}\` \n**__XP:__** \`${data.points}/${neededXP}\``)
            interaction.reply({ embeds: [embed] })
        }

    }}