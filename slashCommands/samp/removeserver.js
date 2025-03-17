
const choice = ["❌", "✅"]
const {stripIndents} = require("common-tags")
const { MessageButton, MessageActionRow } = require("discord.js")
const modelsSamp = require('../../models/sampserver.js')
const lang = require('../../language')
const prefixSchema = require("../../models/prefix")
const wait = require("node:timers/promises").setTimeout
module.exports = {
    name: "removeserver",
    description: "Remove server samp",
    permission: ["MANAGE_GUILD"],
    execute: async (client, interaction, args) => {
      let prefix = "/"
      let msg = interaction
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
        
        if(!data)return msg.reply({ content: stripIndents`
\`\`\`a

${lang(msg.guild, "SET_IP")} ${prefix}setip
\`\`\`` })
        await interaction.deferReply()
        await wait(2000)
        await msg.editReply({ content: stripIndents`
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