const { MessageEmbed } = require("discord.js");
module.exports = {
    config: {
        name: 'balboard',
        description: 'Get balance leaderboards.',
    },
    run: async (bot, interaction, args) => {

        result = await bot.mongo.db("bot").collection(interaction.guild.id).find({}).sort({ balance: -1 })

        let check = "";

        let i = 0

        done = false;

        for await (const x of result) {

            if(i >= 10) {
                if(done === false) {
                    done = true
                    resolve()
                }
                return;
            }


            let guy = await interaction.guild.members.fetch(x._id)
            if(!guy) return;
            i++
            check = check + `${i} ~ ${guy.user.username}, **__BALANCE:__** \`${x.points}\` \n`
        }

        console.log(check)
        let embed = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("SUCCESS")
            .setDescription(`${check}`)

        interaction.reply({embeds: [embed]})

    }
}