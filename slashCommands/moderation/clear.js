const { MessageButton, MessageActionRow, MessageEmbed } = require("discord.js")
const lang = require("../../language")

module.exports = {
  name: "clear",
  description: "Clear message channel",
  permission: "MANAGE_MESSAGES",
  options: [
    { 
      name: "number", 
      type: "NUMBER", 
      description: "Enter amount of messages that you would like to clear", 
      required: true
    },
    { 
      name: "filter",
      description: "Filter",
      type: "STRING",
      required: false,
      choices: [
        {
          name: "Bot",
          value: "bot"
        },
        {
          name: "Links",
          value: "links"
        },
        {
          name: "Attachments",
          value: "attachments"
        }, 
      ]
    }
  ],
  execute: async (client, interaction, args) => {
    let msg = interaction
    const filter = interaction.options.get("filter")
    let [ purge ] = args
    //:if(!purge) return msg.channel.send({ content: "<prefix>clear <amount>"})
    if(purge > 100) purge = 100;
    let messages;
    try {
      if(filter) {
        if(filter && filter.value === "links") {
        messages = await msg.channel.messages.fetch({ limit: purge })
        messages = messages.filter(m => m.content.includes("https://") || m.content.includes("http://"))
        const deleteLinks = await interaction.channel.bulkDelete([...messages.values()], true)
        const result = {}
        for(const [, deleted] of deleteLinks) {
          console.log(deleted)
          const user = `tes`
          if(!result[user]) result[user] = 0
          result[user]++
        }
        const userMap = Object.entries(result)
        const finalResult = `${deleteLinks.size} ${deleteLinks.size > 1 ? '** **' : ''} Links messages were removed`
        if(deleteLinks.size === 0) return interaction.reply({ content: "There are no messages found in this channel", ephemeral: true})
        await interaction.reply({ content: finalResult, ephemeral: true})
       } else if(filter && filter.value === "bot") {
        messages = await msg.channel.messages.fetch({ limit: purge })
        messages = messages.filter(m => m.author.bot)
        const deleteLinks = await interaction.channel.bulkDelete([...messages.values()], true)
        const result = {}
        for(const [, deleted] of deleteLinks) {
          console.log(deleted)
          const user = `tes`
          if(!result[user]) result[user] = 0
          result[user]++
        }
        const userMap = Object.entries(result)
        const finalResult = `${deleteLinks.size} ${deleteLinks.size > 1 ? '** **' : ''} Bot messages were removed`
        if(deleteLinks.size === 0) return interaction.reply({ content: "There are no messages found in this channel", ephemeral: true})
        await interaction.reply({ content: finalResult, ephemeral: true})
       } else if(filter && filter.value === "attachments") {
        messages = await msg.channel.messages.fetch({ limit: purge })
        messages = messages.filter(m => m.attachments.size > 0)
        const deleteLinks = await interaction.channel.bulkDelete([...messages.values()], true)
        const result = {}
        for(const [, deleted] of deleteLinks) {
          console.log(deleted)
          const user = `tes`
          if(!result[user]) result[user] = 0
          result[user]++
        }
        const userMap = Object.entries(result)
        const finalResult = `${deleteLinks.size} ${deleteLinks.size > 1 ? '** **' : ''} Attachments were removed`
        if(deleteLinks.size === 0) return interaction.reply({ content: "There are no messages found in this channel", ephemeral: true})
        await interaction.reply({ content: finalResult, ephemeral: true})
       }
      } else {
        const fetch = await msg.channel.messages.fetch({ limit: purge })
        const deleteMessage = await msg.channel.bulkDelete(fetch, true)
        const result = {};
        for (const [, deleted] of deleteMessage) {
          const user = `${deleted.author.username}#${deleted.author.discriminator}`
          if(!result[user]) result[user] = 0;
          result[user]++;
        }
      
        const userMessageMap = Object.entries(result)
        const finalResult = `${deleteMessage.size} ${deleteMessage.size > 1 ? '** **' : ''} ${lang(msg.guild, "REMOVED")}\n\n${userMessageMap.map(([user, messages]) => `\`${user}\`: ${messages} ${lang(msg.guild, "MESSAGE")}`).join("\n")}`
      
      const Embed = new MessageEmbed()
      .setColor("BLUE")
      .setDescription(finalResult)
      if(deleteMessage.size === 0) return interaction.reply({ content: "There are no messages found in this channel", ephemeral: true})
      
      await msg.reply({ embeds: [Embed], ephemeral: true })
      }
    } catch(e) {
      return msg.reply({ content: e.message, ephemeral: true})
    }
  }
}