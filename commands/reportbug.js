const { MessageEmbed, MessageCollector } = require("discord.js")
 const {stripIndents} = require("common-tags")
 const choice = ["✅", "❌"]
 const channelBug = "872896243867713626"
module.exports = {
    name: "reportbug",
    aliase: ['report'],
    cooldown: 90,
    run: async (client, msg, args) => {
        const bug = args.join(" ")
        if(!bug) return msg.channel.send({ content: "Please enter the bug type" })
        msg.channel.send({ content: "Thank you for your report" }).then(m => setTimeout(() => m.delete(), 5000))
        const bugEmbed = new MessageEmbed()
        .setColor("GREEN")
        .setTitle("New Reported", msg.author.displayAvatarURL({dynamic: true}))
        .setDescription(stripIndents`
        From: ${msg.member.user.tag}
        Use this commands in channel: ${msg.channel.name}
        Report: \`${bug}\``)
        client.channels.cache.get(channelBug).send({ embeds: [bugEmbed] })
    }
}