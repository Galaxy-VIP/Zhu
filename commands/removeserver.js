
const choice = ["❌", "✅"]
const {stripIndents} = require("common-tags")
const { MessageButton, MessageActionRow } = require("discord.js")
const modelsSamp = require('../models/sampserver.js')
const lang = require('../language')
const prefixSchema = require("../models/prefix")
module.exports = {
    name: "removeserver",
    run: async (client, msg, args) => {
        if(!msg.member.permissions.has('MANAGE_GUILD')) return msg.channel.send("**"+lang(msg.guild, "MISSING_PERMISSION")+"**"+"\n\n"+lang(msg.guild, "MANAGE_GUILD_PERMISSION"))
      let prefix;
      const dataPrefix = await prefixSchema.findOne({
        guild: msg.guild.id
      })
      if(dataPrefix === null) {
        prefix = "."
      } else {
        prefix = dataPrefix.prefix
      }
      const acceptButton = new MessageButton()
      .setCustomId("accept")
      .setLabel(lang(msg.guild, "ACCEPT"))
      .setStyle("SUCCESS")

      
      const cancelButton = new MessageButton()
      .setCustomId("cancel")
      .setLabel(lang(msg.guild, "CANCEL"))
      .setStyle("DANGER")
      
      const row = new MessageActionRow()
      .addComponents(
        acceptButton,
        cancelButton
        )
      const filter = i => i.customId === ["accept", "cancel"] && i.user.id === msg.author.id
      
      
      modelsSamp.findOne({ guild: msg.guild.id }, async(err, data) => {
        
        if(!data)return msg.channel.send({ content: stripIndents`
\`\`\`a

${lang(msg.guild, "SET_IP")} ${prefix}setip
\`\`\`` })
        msg.channel.send({ content: stripIndents`
\`\`\`a

${lang(msg.guild, "SELECT_BUTTON")}

${lang(msg.guild, "ACCEPT")}
${lang(msg.guild, "CANCEL")}
\`\`\``, components: [row] }).then(m => {
          const collector = m.createMessageComponentCollector({ componentType: "BUTTON", time: 60 * 1000})
          collector.on("collect", async (i) => {
            if(i.user.id) {
              if(i.customId === "accept") {
                await i.update({ components: [] })
                await modelsSamp.findOneAndDelete({ guild: msg.guild.id })
                m.edit({ content: stripIndents`
\`\`\`a

${lang(msg.guild, "SUCCESS_DELETED_SAMP")}
\`\`\`` })
              } else if(i.customId === "cancel") {
                await i.update({ components: [] })
                m.edit({ content: stripIndents`
\`\`\`a

${lang(msg.guild, "CANCEL_DELETED_SAMP")}
\`\`\`` })
              }
            } else {
              i.deferUpdate()
            }
          })
        })
      })
    }
}