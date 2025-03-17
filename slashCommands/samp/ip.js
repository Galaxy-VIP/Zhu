
const {stripIndents} = require("common-tags")
const modelsSamp = require('../../models/sampserver.js')
const prefixSchema = require('../../models/prefix')
const lang = require('../../language')
module.exports = {
    name: "ip",
    cooldown: 4,
    run: async (client, msg, args) => {
        let prefix;
        const dataPrefix = await prefixSchema.findOne({ guild: msg.guild.id})
        if(dataPrefix === null) {
          prefix = '.'
        } else {
          prefix = dataPrefix.prefix
        }
        modelsSamp.findOne({ guild: msg.guild.id}, async(err, data) => {
            const sampServer = data
            if(sampServer === null) return msg.channel.send({ content: lang(msg.guild, "SET_IP")+ " " + `${prefix}ip` })
        if(!args[0]) return msg.channel.send({ content: `${prefix}ip show/hide/unhide` })
        if(args[0] === "hide") {
          if(!data) return msg.channel.send({ content: lang(msg.guild, "IP_NOT_SET")})
            if(!msg.member.permissions.has("ADMINISTRATOR")) return msg.channel.send({ content: lang(msg.guild, "ADMINISTRATOR_PERMISSION") })
                await modelsSamp.findOneAndUpdate(
                  {
                    guild: msg.guild.id
                  },
                  {
                    status: "hide"
                  },
                  {
                    upsert: true
                  }
                  )
          msg.channel.send(lang(msg.guild, "IP_SET_HIDE"))
        } else if(args[0] === "unhide") {
          if(!data) return msg.channel.send({ content: lang(msg.guild, "IP_NOT_SET")})
          if(!msg.member.permissions.has("ADMINISTRATOR")) return msg.channel.send({ content: lang(msg.guild, "ADMINISTRATOR_PERMISSION") })     
          await modelsSamp.findOneAndUpdate(
            {
              guild: msg.guild.id
            },
            {
              status: "unhide"
            },
            {
              upsert: true
            }
            )
            msg.channel.send({ content: lang(msg.guild, "IP_IS_UNHIDE") })
        } else if(args[0] === "show") {
          if(!data) return msg.channel.send({ content: lang(msg.guild, "IP_NOT_SET")})
          if(sampServer.status === "hide") {
            return msg.channel.send({ content: lang(msg.guild, "IP_IS_HIDE") })
          } 
          if(sampServer.status === "unhide") {
            return msg.channel.send({ content: stripIndents`
\`\`\`a
${lang(msg.guild, 'IP_SHOW')}

IP: ${sampServer.ip}
Port: ${sampServer.port}
\`\`\`` }).catch((e) => msg.channel.send({ content: lang(msg.guild, "CANNOT_DMS") }))
          }
        }
        })
    }
}