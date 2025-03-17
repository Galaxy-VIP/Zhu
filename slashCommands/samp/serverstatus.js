const axios = require("axios")
const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js")
const {stripIndents} = require("common-tags")
const samp = require("samp-query")
const modelsSamp = require('../../models/sampserver.js')
const lang = require("../../language")
const wait = require("node:timers/promises").setTimeout
module.exports = {
    name: "serverstatus",
    description: "Server status",
    execute: async (client, interaction, args) => {
         let msg = interaction
         let prefix = "/"
         modelsSamp.findOne({ guild : msg.guild.id }, async(err, data) => {
             if(!data) return msg.channel.send({ content: lang(msg.guild, "IP_NOT_SET") + " " + `${prefix}setip` })
         const serversamp = data
        const options = {
            host: serversamp.ip,
            port: serversamp.port
        }
        let players = new MessageButton()
        .setLabel(lang(msg.guild, "ONLINE_PLAYERS"))
        .setCustomId("onlineplayers")
        .setStyle("SUCCESS")
        
        let deleteMessage = new MessageButton()
        .setEmoji("🗑️")
        .setCustomId("deletemsg")
        .setStyle("DANGER")
        
        let row = new MessageActionRow().addComponents(deleteMessage, players)
        samp(options, async function(err, state) {
            if(err) {
              await interaction.deferReply()
              await wait(2000)
              await msg.editReply({ content: lang(msg.guild, "SERVER_OFFLINE") })
            } else if(state) {
            const ServerStats = new MessageEmbed()
            .setColor("BLUE")
            .setTitle(state.hostname)
            .addField("Gamemode",  state.gamemode, true)
            .addField(lang(msg.guild, "LANGUAGE"), state.mapname ? state.mapname : "** **")
            .addField(lang(msg.guild, "VERSION_SERVER"), state.rules.version, true)
            .addField("Status", "Online")
            .addField(lang(msg.guild, "ONLINE_PLAYERS"), state.online + " / " + state.maxplayers, true)
            await interaction.deferReply()
            await wait(2000)
            await msg.editReply({ embeds: [ServerStats], components: [row] }).then(async (m) => {
              const collector = m.createMessageComponentCollector({ componentType: "BUTTON", time: 120 * 1000})
              collector.on("collect", async (i) => {
                if(i.user.id) {
                  if(i.customId === "deletemsg") {
                    await m.delete()
                    collector.stop("ya")
                  } else if(i.customId === "onlineplayers") {
                    await i.deferUpdate()
                    const newRow = new MessageActionRow().addComponents(deleteMessage)
                    await m.edit({ embeds: [ServerStats], components: [newRow]})
                    client.commands.get("players").run(client, msg, args)
                    m.delete()
                  }
                } else {
                  i.deferUpdate()
                }
              })
              collector.on("end", async(ignore, err)=> {
                if(err && err !== "ya") {
                  try {
                    const deleteEnd = new MessageButton()
                    .setEmoji("🗑️")
                    .setStyle("DANGER")
                    .setCustomId("deleteend")
                    .setDisabled(true)
                
                    const playerson = new MessageButton()
                    .setLabel(lang(msg.guild, "ONLINE_PLAYERS"))
                    .setCustomId("playerson")
                    .setStyle("SUCCESS")
                    .setDisabled(true)
                
                    const row2 = new MessageActionRow().addComponents(deleteEnd,playerson)
                    ServerStats.setFooter("Message delete in 10 seconds")
                    m.edit({ embeds: [ServerStats], components: [row2]}).then(e => setTimeout(() => e.delete(), 10000)).catch(e => console.log("error"))
                  } catch(e) {
                    console.log("dunno")
                  }
                }
              })
            })
            }
        })
         })
    }
}