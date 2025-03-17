const { MessageSelectMenu, MessageActionRow, MessageEmbed } = require('discord.js')
const { stripIndents } = require("common-tags")
const wait = require('node:timers/promises').setTimeout;
//const prefixSchema = require("../models/prefix")
module.exports = {
  name: "help",
  description: "Help",
  execute: async (client, interaction, args) => {
    let OnorOFf = true
    const msg = interaction
    const prefix = "/"
    const Menu = new MessageSelectMenu()
    .setPlaceholder("Choose a category")
    .setCustomId("select")
    .addOptions([
      {
        label: "Utility",
        description: "Shows all utility commands",
        value: "value_utility",
        emoji: "⚙️"
      },
      {
        label: "Moderation",
        description: "Shows all moderation commands",
        value: "value_moderation",
        emoji: "<:staff:809959358770839563>"
      },
      {
        label: "Sa-mp",
        description: "Shows all sa-mp commands",
        value: "value_samp",
        emoji: "<:iconsamp:1270379750807965840>"
      },
      {
        label: "Information",
        description: "Shows all information commands",
        value: "value_information",
        emoji: "<:info:1270385384571928819>"
      },
      {
        label: "Back to the help menu",
        description: "Go back to the help menu",
        value: "value_back",
        emoji: "◀️",
        disabled: OnorOFf
      }
    ])
    const row = new MessageActionRow()
    .addComponents(Menu)
    const embed = new MessageEmbed()
    .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true}))
    .addField("<:staff:809959358770839563> Moderation", "\`auditlogs\`, \`auditlogs-delete\`, \`admin-panel\`, \`mod-panel\`, \`automod-keyword\`, \`automod-flaggedword\`, \`automod-mentionspam\`, \`ban\`, \`clear\`, \`setprefix\`")
    .addField("<:Roles:1277273730846031884> Reaction roles", "\`reactionroles-add\`, \`reactionroles-remove\`")
    .addField("<:iconsamp:1270379750807965840> Samp", '\`setip\`, \`ip\`, \`removeserver\`, \`players\`, \`serverstatus\`')
    .addField("<:info:1270385384571928819> Information", "\`nasa\`, \`avatar\`, \`serveravatar\`, \`lyrics\`, \`stats\`, \`topgg\`, \`worldclock\`, \`weather\`, \`whois\`")
    .addField("⚙️ Utility", "\`youtubestats\`, \`youtubedownload\`, \`playstore\`, \`movie\`, \`playstore\`, \`appstore\`, \`movie\`, \`translate\`, \`snipe\`")
    .addField("🗣 Confession", "\`confess\`, \`confession-setup\`, \`confession-blacklist\`, \`confession-unblacklist\`, \`confession-delete\`, \`confession-renew\`, \`confession-check\`")
    .addField("<:unnamed1:1277272554700279879> LastFM", "`\lastfm-set\`, \`lastfm\`, \`lastfm-top\`, \`lastfm-whoknows\`")
    .setColor("GREEN")
    .setDescription("Please select the menu below.")
    .setTimestamp()
    
    await msg.deferReply()
    await wait(3000)
    await msg.editReply({ embeds: [embed], components: [row]}).then(m => {
      //console.log(m)
      const collector = m.createMessageComponentCollector({ componentType: "SELECT_MENU", time: 240000})
      collector.on("collect", async (i) => {
        try {
        if(i.user.id) {
          if(i.values[0] === 'value_utility') {
            OnorOFf = false
            const utilityEmbed = new MessageEmbed()
            .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true}))
            .setTitle("⚙️ Utility Category")
            .setColor("GREEN")
            .setThumbnail(msg.guild.iconURL({dynamic:true}))
            .setDescription(stripIndents`
            Some of the commands in the utility category. Thank you for using this bot
            
            ${prefix}youtubestats - **Stats a youtube channel**
            ${prefix}youtubedownload - **Download music from youtube**
            ${prefix}ping - **Bot latency**
            ${prefix}report - **Report if there is a bug in this bot**
            ${prefix}steam - **Searching for existing games on steam** 
            ${prefix}movie - **Search a movie by name** 
            ${prefix}playstore - **Search an application by name** 
            ${prefix}appstore - **Search an application by name** 
            `)
            await i.deferUpdate()
            await m.edit({ embeds: [utilityEmbed], components: [row]})
          } else if(i.values[0] === "value_moderation") {
            OnorOFf = false
            const moderationEmbed = new MessageEmbed()
            .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true}))
            .setColor("GREEN")
            .setThumbnail(msg.guild.iconURL({dynamic: true}))
            .setTitle("<:staff:809959358770839563> Moderation Category")
            .setDescription(stripIndents`
            Some of the commands in the moderation category. Thank you for using this bot
            
            
            ${prefix}clear - **Delete the chat with the amount you want to clear** 
            ${prefix}setprefix - **Change the bot prefix you want**
            ${prefix}admin-panel - **To moderate members**
            ${prefix}mod-panel - **To moderate members**
            ${prefix}reactionroles-add - **Add a reaction roles**
            ${prefix}reactionroles-remove - **Remove reaction roles**
            ${prefix}auditlogs - **Setup audit logs system**
            ${prefix}auditlogs-delete - **Delete audit logs system**
            ${prefix}ban - **Ban member**
            ${prefix}automod-flaggedword - **Block profanity and sexual content**
            ${prefix}automod-mentionspam - **BBlock spam mentions**
            ${prefix}automod-keyword - **Block a given word in the server**
            `)
            await i.deferUpdate()
            await m.edit({ embeds: [moderationEmbed], components: [row]})
          } else if(i.values[0] === "value_samp") {
            OnorOFf = false
            const sampEmbed = new MessageEmbed()
            .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true}))
            .setColor("GREEN")
            .setThumbnail(msg.guild.iconURL({dynamic:true}))
            .setTitle("<:iconsamp:1270379750807965840> Sa-mp Category")
            .setDescription(stripIndents`
            Some of the commands in the sa-mp category. Thank you for using this bot
            
            ${prefix}setip - **Set ip sa-mp** 
            ${prefix}ip - **Set hide ip or show ip sa-mp** 
            ${prefix}players - **Shows currently online players** 
            ${prefix}serverstatus - **Shows sa-mp server statistics** 
            ${prefix}removeserver - **Remove sa-mp server**
            `)
            await i.deferUpdate()
            await m.edit({ embeds: [sampEmbed], components: [row]})
            
        } else if(i.values[0] === "value_information") {
          OnorOFf = false
          const infoEmbed = new MessageEmbed()
          .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true}))
          .setTitle("<:info:1270385384571928819> Information Category")
          .setThumbnail(msg.guild.iconURL({dynamic:true}))
          .setDescription(stripIndents`
          Some of the commands in the information category. Thank you for using this bot
          
          ${prefix}serveravatar - **Server avatar** 
          ${prefix}topgg - **Shows bot information on Top.GG** 
          ${prefix}avatar - **Avatar of user** 
          ${prefix}worldclock - **World clock** 
          ${prefix}whois - **Shows user information** 
          ${prefix}worldclock - **Shows world clock** 
          ${prefix}lyrics - **Search a music lyric**
          ${prefix}nasa - **Picture of the day Nasa**
          `)
          .setColor("GREEN")
          
          await i.deferUpdate()
          await m.edit({ embeds: [infoEmbed], components: [row]})
        } else if(i.values[0] === "value_back") {
          OnorOFf = true
          await i.deferUpdate()
          await m.edit({ embeds: [embed], components: [row]})
         }
        } else {
          i.deferUpdate()
        }
         } catch(e) {
           return interaction.reply({ content: `Oh no! got an error: \`${e.message}\``})
        }
      })
      collector.on("end", async (i) => {
        embed.setFooter("This embed is invalid")
        embed.setColor("YELLOW")
        await interaction.editReply({ embeds: [embed], components: [] })
      })
    })
  }
}