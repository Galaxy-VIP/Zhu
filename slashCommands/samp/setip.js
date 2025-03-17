const {stripIndents} = require("common-tags")
const axios = require("axios")
const samp = require("samp-query")
const modelsSamp = require('../../models/sampserver.js')
const lang = require("../../language")
const wait = require("node:timers/promises").setTimeout
module.exports = { 
    name: "setip",
    description: "Samp ip manage",
    permission: ["MANAGE_GUILD"],
    options: [
      {
      name: "ip",
      description: "Enter an ip address",
      required: true,
      type: "STRING"
    },
      {
        name: "port",
        description: "Enter the port",
        required: true,
        type: "NUMBER"
      }
    ],
    execute: async (client, interaction, args) => {
      let msg = interaction
      let prefix = "/"
      let [ ip, port ] = args
        const options = {
            host: ip,
            port: port
        }
        const data = await modelsSamp.findOne({
          guild: msg.guild.id
        })
        samp(options, async function(err, stat) {
            if(err) {
                await interaction.deferReply()
                await wait(3000)
                var offmsg = await msg.editReply({ content: stripIndents`
\`\`\`a
${lang(msg.guild, "SETTING_PROCESS")}

Address: ********
\`\`\`` })
                setTimeout(async function() {
                    offmsg.edit({ content: stripIndents`
\`\`\`a
${lang(msg.guild, "SETTING_PROCESS")}

Address: ********
Port: ${port}
\`\`\`` })
                }, 2000)
                    setTimeout(async function() {
                        offmsg.edit({ content: stripIndents`
\`\`\`a
${lang(msg.guild, "SETTING_FAILED")}

Address: ********
Port: ${port}

${lang(msg.guild, "SERVER_OFFLINE")} ❌
\`\`\`` })
                    }, 5000)
            }
            else if(stat) {
                const onmsg = await msg.channel.send({ content: stripIndents`
\`\`\`a
${lang(msg.guild, "SETTING_PROCESS")}

Address: ********
\`\`\`` })
                            setTimeout(async function() {
                                onmsg.edit({ content: stripIndents`
\`\`\`a
${lang(msg.guild, "SETTING_PROCESS")}

Address: ********
Port: ${port}
\`\`\`` })
                            }, 2000)
            setTimeout(async function() {
                onmsg.edit({ content: stripIndents`
\`\`\`a
${lang(msg.guild, "SETTING_SUCCESS")}

Address: ********
${lang(msg.guild, "SERVER_NAME")}: ${stat.hostname}
Port: ${port}

${lang(msg.guild, "SERVER_ONLINE")} ✅

${lang(msg.guild, "CHECK")} ${prefix}serverstatus or ${prefix}players
\`\`\`` })
              if(!data) {
                let newData = await modelsSamp.create({
                  guild: msg.guild.id,
                  ip: ip,
                  port: port
                })
                newData.save()
              } else {
                await modelsSamp.findOneAndUpdate(
                  {
                  guild: msg.guild.id
                  },
                  {
                    guild: msg.guild.id,
                    ip: ip,
                    port: port
                  },
                  {
                    upsert: true
                  }
                  )
              }
            }, 5000)
            }
        })
    }
}