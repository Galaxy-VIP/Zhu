const samp = require("samp-query");
const sampSchema = require("../models/sampserver");
const lang = require("../language");
const prefixSchema = require("../models/prefix");
const { stripIndents } = require("common-tags");
const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const wait = require("util").promisify(setTimeout);
module.exports = {
  name: "players",
  aliases: ["player"],
  run: async (client, msg, args) => {
    let prefix;

    let dataPrefix = await prefixSchema.findOne({ guild: msg.guild.id });
    if (dataPrefix === null) {
      prefix = ".";
    } else {
      prefix = dataPrefix.prefix;
    }
    let data = await sampSchema.findOne({ guild: msg.guild.id });
    if (!data)
      return msg.channel.send({
        content: lang(msg.guild, "IP_NOT_SET") + " " + prefix + "setip"
      });
    let options = {
      host: data.ip,
      port: data.port
    };
    let refreshButton = new MessageButton()
      .setLabel("Refresh")
      .setStyle("SUCCESS")
      .setCustomId("refresh");
    let row = new MessageActionRow().addComponents(refreshButton);

    samp(options, async function(err, state) {
      if (err) {
        return msg.channel.send({ content: lang(msg.guild, "SERVER_OFFLINE") });
      } else if (state) {
        let playerslst = state.players.map(
          e => `\`${e.id} :   ${e.name.replace("_", " ")}  :   ${e.ping} ms\``
        );
        if (playerslst === false) playerslst = "** **"
        const embed = new MessageEmbed()
          .setColor("GREEN")
          .setTitle(state.hostname)
          .setTimestamp()
          .setDescription(stripIndents`
      [ ${state.online} Players Online ]
      
      
      [  ID  : Players Name  : Players Ping  ]
        ${playerslst.join("\n")}`);

        msg.channel.send({ embeds: [embed], components: [row] }).then(m => {
            const collector = m.createMessageComponentCollector({
              componentType: "BUTTON",
              time: 120 * 1000
            });
            collector.on("collect", async i => {
              let options = {
                host: data.ip,
                port: data.port
              };
              samp(options, async function(err, state) {
                if(err) {
                  console.log(err)
                  i.deferUpdate()
                } else if(state) {
                  let playerslst = state.players.map(
          e => `\`${e.id} :   ${e.name.replace("_", " ")}  :   ${e.ping} ms\``
        );
        if (playerslst === false) playerslst = "** **"
                  if (i.user.id) {
                    if (i.customId === "refresh") {
                      const row2 = new MessageActionRow()
                      .addComponents(refreshButton)
                      const updateEmbed = new MessageEmbed()
                      .setColor("GREEN")
                      .setTitle(state.hostname)
                      .setTimestamp()
                      .setDescription(stripIndents`
                    [ ${state.online} Players Online ]
                    
                    
                    [  ID  : Players Name  : Players Ping  ]
                    ${playerslst.join("\n")}`);
                    await i.deferUpdate()
                    await m.edit({ embeds: [updateEmbed], components: []})
                    wait(2000)
                    await m.edit({ embeds: [updateEmbed], components: [row]})
                  }
                } else {
                  i.deferUpdate();
                }
                }
              })
            })
          collector.on("end", async i => {
            const refreshTimeout = new MessageButton()
            .setLabel("Refresh")
            .setStyle("SUCCESS")
            .setDisabled(true)
            .setCustomId("refreshTimeout")
            const row3 = new MessageActionRow().addComponents(refreshTimeout)
            m.edit({ embeds: [embed], components: [row3]})
          })
        })
      }
    })
  }
}