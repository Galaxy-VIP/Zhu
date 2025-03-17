const samp = require("samp-query")
const sampSchema = require("../models/sampserver")
const lang = require("../language")
const prefixSchema = require("../models/prefix")
const { stripIndents } = require("common-tags")
const { MessageEmbed } = require("discord.js")
module.exports = {
  name: "player",
  aliases: ["players"],
  run: async (client, msg, args) => {
    let prefix
    
    let dataPrefix = await prefixSchema.findOne({ guild: msg.guild.id})
    if(dataPrefix === null) {
      prefix = "."
    } else {
      prefix = dataPrefix.prefix
    }
    let data = await sampSchema.findOne({ guild: msg.guild.id})
    if(!data) return msg.channel.send({ content: lang(msg.guild, "IP_NOT_SET") + " " + prefix+"setip"})
    let options = {
      host: data.ip,
      port: data.port
    }
    
    samp(options, async function(err, state) {
      if(err) {
        return msg.channel.send({ content: lang(msg.guild, "SERVER_OFFLINE")})
      } else if(state) {
        let playerslst = state.players.map((e) => `\| ${e.id} \| ${e.name} \|  ${e.ping} \|`)
        if(playerslst === false) playerslst = "_ _"
        let embed = new MessageEmbed()
        .setColor("GREEN")
        .setTitle(state.hostname)
        .setDescription(stripIndents`
        ---------------------------------------------:
        :                                           
        :
        ${playerslst.join("\n")}`)
        msg.channel.send({ embeds: [embed]})
      }
    })
  }
}