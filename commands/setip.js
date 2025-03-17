
const {stripIndents} = require("common-tags")
const axios = require("axios")
const samp = require("samp-query")
const modelsSamp = require('../models/sampserver.js')
const lang = require("../language")
const prefixSchema = require("../models/prefix")
module.exports = { 
    name: "setip",
    run: async (client, msg, args) => {
        let prefix;
      let dataPrefix = await prefixSchema.findOne({
        guild: msg.guild.id
      })
      if(dataPrefix === null) {
        prefix = "."
      } else {
        prefix = dataPrefix.prefix
      }
        if(!msg.member.permissions.has("MANAGE_GUILD")) return msg.channel.send({ content: `**${lang(msg.guild, "MISSING_PERMISSION")}**\n\n`+ lang(msg.guild, "MANAGE_GUILD_PERMISSION") })
        const ip = args[0]
        if(!ip) return msg.channel.send({ content: stripIndents`
\`\`\`a
${lang(msg.guild, "INSTRUCTIONS")}

${prefix}setip ${lang(msg.guild, "IP_SET_INSTRUCTIONS")}
\`\`\`` })
        const port = args[1]
        if(!port) return msg.channel.send({ content: stripIndents`
\`\`\`a
${lang(msg.guild, "INSTRUCTIONS")}

.${prefix}setip ${lang(msg.guild, "IP_SET_INSTRUCTIONS")}
\`\`\`` })
        const options = {
            host: ip,
            port: port
        }
        const data = await modelsSamp.findOne({
          guild: msg.guild.id
        })
        samp(options, async function(err, stat) {
            if(err) {
                var offmsg = await msg.channel.send({ content: stripIndents`
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

${lang(msg.guild, "CHECK")} ${prefix}serverstatus / ${prefix}players
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