const samp = require("samp-query");
const sampSchema = require("../../models/sampserver");
const lang = require("../../language");
const { stripIndents } = require("common-tags");
const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const wait = require("node:timers/promises").setTimeout
module.exports = {
  name: "players",
  description: "Players online",
  execute: async (client, interaction, args) => {
    let msg = interaction
    let prefix = "/"
    let data = await sampSchema.findOne({ guild: msg.guild.id });
    if (!data)
      await msg.reply({
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
        await interaction.deferReply()
        await wait(2000)
        await msg.editReply({ content: lang(msg.guild, "SERVER_OFFLINE") });
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
        await interaction.deferReply()
        await wait(2000)
        await msg.editReply({ embeds: [embed], components: [row] }).then(m => {
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