const Discord = require('discord.js')
const snekfetch = require("snekfetch")
const {stripIndents} = require('common-tags')
const lang = require('../language')
const { fetch } = require('fs')
module.exports = {
    name: 'weather',
    cooldown: 5,
    aliases: ['wtt, wttr, wtr'],
    run: async(client, message, args) => {
        let msg = message
        const name = args[0] || "London"
        if(!name) return msg.channel.send('?')
        if(!isNaN(name)) return msg.channel.send('?')
        const { MessageAttachment } = require('discord.js')
        const a = new MessageAttachment(`https://wttr.in/${name}_p.png`, 'w.png')
        msg.channel.send({files: [a]})
    }
}