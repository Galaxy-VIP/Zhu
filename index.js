const Discord = require("discord.js")
const client = new Discord.Client({ intents: 32767, partials: ["MESSAGE", "CHANNEL", "REACTION"] })
client.options.http.api = "https://discord.com/api"
const { MessageEmbed, Events } = require('discord.js')
const { DiscordBanners } = require('discord-banners');
const discordBanners = new DiscordBanners(client);
const fs = require("fs")
const mongoose = require("mongoose")
const { HYPIXEL } = require('./config.json')
const Hypixel = require("hypixel-api-reborn")
const hy = new Hypixel.Client("12")
client.hypixel = hy
client.util = require("./util.js")
const { mongodburl } = require("./config.json")
const { get } = require("node-superfetch")
const DBL = require("dblapi.js");
const dbl = new DBL("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg2NDAyNjA0MzM3ODU2NTE2MCIsImJvdCI6dHJ1ZSwiaWF0IjoxNjI3MzA4NTY3fQ.searxcymYsI0v0gfNt91oXLSHqWIOzNMx4shyxmiRgM", client);
client.dbl = dbl
const { readdirSync } = require("fs");
const express = require("express")
const app = express()
const samp = require("samp-query")
const tokenShocks = 'iq1eciZu&*Dp7fvXd!(H'
const sampServer = require('./models/sampserver.js')
const prefixSchema = require('./models/prefix')
const { loadLanguages } = require("./language")
const langSchema = require("./models/language")
const sampLive = require("./models/samplive")
const logsSchema = require('./models/logs')
const { stripIndents } = require('common-tags')
const lang = require("./language")
const { MovieDb } = require('moviedb-promise')
const moviedb = new MovieDb("438d8c8767d77cfdacc9e93136b086d4")
client.movie = moviedb
const reactionRole = require('./models/reactionrole')
const starboardSchema = require('./models/starboard')
const mongoOptions = {
    useNewUrlParser:true,
    useUnifiedTopology: true,
    useFindAndModify: true
}

app.get("/", (req, res) => {
  res.sendStatus(200)
})
  app.listen(process.env.PORT || 3000)

const axios = require("axios")

setInterval(() => {
  loadLanguages(client)
  console.log("Load all guild languages")
}, 300 * 1000)

//client.on("debug", console.log)
client.on("ready", async () => {
    //await shockbs.connect(process.env.SHOCKBS_KEY)
    console.log("Online" + " " + client.user.name)
    client.user.setActivity(`v.help or /help`)
    loadLanguages(client)
    await mongoose.connect(mongodburl, mongoOptions)
    console.log("✅ | Connected to mongodb")
})
client.on('interactionCreate', async interaction => {
	try {
    if (interaction.isCommand()) {
      if(interaction.commandName === 'ping') {
        return interaction.reply({ content: `Pong ${client.ws.ping}ms`})
      }
      const cmd = client.slashCommands.get(interaction.commandName);
      if (!cmd) return interaction.reply({content: "Something Went Wrong", ephemeral: true});
      
      
      
      if(cmd.permission) {
        const authorPerms = interaction.channel.permissionsFor(interaction.member)
        if(!authorPerms || !authorPerms.has(cmd.permission)) {
          const permEmbed = new Discord.MessageEmbed()
          .setColor("BLUE")
          .setDescription(lang(interaction.guild, "INTERACTION_PERMISSION") + " " + cmd.permission)
          return interaction.reply({ embeds: [permEmbed], ephemeral: true})
        }
      }
      if(cmd.ownerOnly) {
       if(!['671351376642834440','1005082777206661190', '627027667685867530', '1005082777206661190'].includes(interaction.member.id)) {
         return interaction.reply({ content: 'Owner only', ephemeral: true })
       }
     }
      const args = []
      for (let option of interaction.options.data) {
            if (option.type === "SUB_COMMAND") {
                if (option.name) args.push(option.name);
                option.options?.forEach((x) => {
                    if (x.value) args.push(x.value);
                });
            } else if (option.value) args.push(option.value);
        }
      cmd.execute(client, interaction, args);
    }
  } catch (err) {
    console.log("Something Went Wrong => ",err);
  }
});


//

//

//

client.on("messageReactionAdd", async(react, user) => {

  if(react.message.partial) await react.message.fetch()
  if(react.partial)await react.fetch()
  
  if(!react.message.guildId) return
  if(user.bot) return
  
  let emojiID = `<:${react.emoji.name}:${react.emoji.id}>`
  if(!react.emoji.id) {
    emojiID = react.emoji.name
  }
  
  
  const reactData = await reactionRole.findOne({ guild: react.message.guildId, message: react.message.id, emoji: emojiID})
  
  if(!reactData) return
  
  const guild = await client.guilds.cache.get(react.message.guildId)
  const member = await guild.members.cache.get(user.id)
  
  try { 
  
    const embed = new MessageEmbed()
    .setColor("GREEN")
    .setDescription(`✅ I have added a role <@&${reactData.role}> to ${member}`)
    await member.roles.add(reactData.role)
    await react.message.reply({ embeds: [embed]}).then(m => setTimeout(() => m.delete(), 5000))
  } catch(e) {
    const embed = new MessageEmbed()
    .setColor("RED")
    .setDescription("My roles is below the roles that i'm trying to give")
    return react.message.reply({ embeds: [embed]}).then(m => setTimeout(() => m.delete(), 5000))
    console.log(e)
    console.log(reactData.role)
  }

})

client.on("messageReactionRemove", async(react, user) => {
  
  if(react.message.partial) await react.message.fetch
  if(react.partial) await react.fetch()
  
  
  if(!react.message.guildId) return
  if(user.bot) return
  
  let emojiID = `<:${react.emoji.name}:${react.emoji.id}>`
  if(!react.emoji.id) {
    emojiID = react.emoji.name
  }
  
  
  const reactData = await reactionRole.findOne({ guild: react.message.guildId, message: react.message.id, emoji: emojiID})
  
  if(!reactData) return
  
  const guild = await client.guilds.cache.get(react.message.guildId)
  const member = await guild.members.cache.get(user.id)
  
  try { 
  
    const embed = new MessageEmbed()
    .setColor("ORANGE")
    .setDescription(`✅ I have removed a role <@&${reactData.role}> from ${member}`)
    await member.roles.remove(reactData.role)
    await react.message.reply({ embeds : [embed]}).then(m => setTimeout(() => m.delete(), 5000))
  } catch(e) {
    const embed = new MessageEmbed()
    .setColor("RED")
    .setDescription("My roles is below the roles that i'm trying to give")
    return react.message.reply({ embeds: [embed]}).then(m => setTimeout(() => m.delete(), 5000))
    console.log(e)
    console.log(reactData.role)
  }

})
//
//
//

//

client.on('guildDelete', async(guild) => {
  client.channels.cache.get('1270076573823008769').send({ content: `Removed from server \`${guild.name}(${guild.id})\``})
  sampServer.findOne({ guild: guild.id }, async(err, data) => {
    if(err) return;
    if(data) {
      sampServer.findOneAndDelete({ guild:guild.id }).then(console.log('Deleted database samp from guild ' + guild.name))
    }
  })
  prefixSchema.findOne({ guild: guild.id }, async(err, data) => {
    if(err) return;
    if(data) {
      prefixSchema.findOneAndDelete({ guild: guild.id}).then(console.log('Deleted database prefixes from guild '+ guild.name))
    }
  })
  langSchema.findOne({ _id: guild.id}, async(err, data) => {
    if(err) return
    if(data) {
      langSchema.findOneAndDelete({ _id: guild.id}).then(console.log("Deleted database language from guild " + guild.name))
    }
  })
  sampLive.findOne({ guild: guild.id}, async(err, data) => {
    if(err) return
    if(data) {
      sampLive.findOneAndDelete({ guild: guild.id}).then(console.log("Deleted database samp live from guild "+ guild.name))
    }
  })
})
client.on("guildCreate", async(guild) => {
  client.channels.cache.get('1270076573823008769').send({ content: `Added to the server \`${guild.name}(${guild.id})\``})
  loadLanguages(client)
})


client.snipes = new Map();
//audit log 
client.on("messageDelete", async(message) => {
  client.snipes.set(message.channel.id, message, {
    content: message.content,
    author: message.author,
    image: message.attachments.first()
      ? message.attachments.first().proxyURL
      : null
  })
  if(message.author && message.author.bot) return;
  const data = await logsSchema.findOne({
    guild: message.guild.id,
  })
  let logChannelId
  if(data) {
    logChannelId = data.channel
  } else {
    return;
  }
  let image = message.attachments.first()
  const auditEmbed = new MessageEmbed()
  .setColor("BLUE")
  .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
  .addField("🗑️ Message Deleted", message.content || "Embed Or Attachment")
  .addField("Message Dated", `${new Date().toLocaleString()}`)
  .addField("Users", stripIndents`
  > <@${message.author.id}>(${message.author.id})
  > <#${message.channel.id}>(${message.channel.id})
  > Message(${message.id})`)
  .setFooter(client.user.username + " Logs")
  if(message.attachments.size > 0) {
    auditEmbed.setImage(image.url ? image.proxyURL : null)
  }
  
  client.channels.cache.get(logChannelId).send({ embeds: [auditEmbed]})
  
})

client.on("messageUpdate", async(oldMessage, newMessage) => {
  if (oldMessage.content === newMessage.content) return;
  
  
  const data = await logsSchema.findOne({
    guild: newMessage.guild.id,
  })
  let logChannelId
  if(data) {
    logChannelId = data.channel
  } else {
    return;
  }
  const count = 1950
  //const original = oldMessage.content.slice(0, count) + (oldMessage.content.length > count ? "..." : "Unknown")
  //const edited = newMessage.content.slice(0, count) + (newMessage.content.length > count ? "..." : "Unknown")
  const auditEmbed = new MessageEmbed()
  .setColor("BLUE")
  .setAuthor(newMessage.author.username, newMessage.author.displayAvatarURL({ dynamic: true }))
  .addField("📝 Message Edited", `<#${oldMessage.channel.id}>`)
  .addField("Old message", oldMessage.content || "Embed Or Attachment")
  .addField("New message", newMessage.content || "Embed Or Attachment")
  .addField("Message Dated", `${new Date().toLocaleString()}`)
  .addField("Users", stripIndents`
  > <@${newMessage.member.id}>(${oldMessage.member.id})
  > <#${oldMessage.channel.id}>(${oldMessage.channel.id})
  > Message(${oldMessage.id})`)
  .setFooter(client.user.username + " Logs")
  
  client.channels.cache.get(logChannelId).send({ embeds: [auditEmbed]})
  
})

client.on('voiceStateUpdate', async(oldState, newState) => {
  const data = await logsSchema.findOne({
    guild: newState.guild.id,
  })
  let logChannelId
  if(data) {
    logChannelId = data.channel
  } else {
    return;
  }

    if (!oldState.channel && newState.channel) {
      const auditEmbed = new MessageEmbed()
      .setColor("BLUE")
      .setAuthor(newState.member.user.username, newState.member.user.displayAvatarURL({ dynamic: true }))
      .addField("📥 Member voice joined channel", `<#${newState.channel.id}>`)
      .addField("Users", stripIndents`
      > <@${newState.member.user.id}>(${newState.member.user.id})
      > <#${newState.channel.id}>(${newState.channel.id}))`)
      .setFooter(client.user.username + " Logs")

      client.channels.cache.get(logChannelId).send({ embeds: [auditEmbed]})
    } else if (oldState.channel && !newState.channel) {
      const auditEmbed = new MessageEmbed()
      .setColor("BLUE")
      .setAuthor(oldState.member.user.username, oldState.member.user.displayAvatarURL({ dynamic: true }))
      .addField("📤 Member left voice channel", `<#${oldState.channel.id}>`)
      .addField("Users", stripIndents`
      > <@${oldState.member.user.id}>(${oldState.member.user.id})
      > <#${oldState.channel.id}>(${oldState.channel.id}))`)
      .setFooter(client.user.username + " Logs")
      
      client.channels.cache.get(logChannelId).send({ embeds: [auditEmbed]})
    } else if (oldState.channel && newState.channel && oldState.channel !== newState.channel) {
      const auditEmbed = new MessageEmbed()
      .setColor("BLUE")
      .setAuthor(oldState.member.user.username, oldState.member.user.displayAvatarURL({ dynamic: true }))
      .addField("🔉 Was moved", `<#${oldState.channel.id}>`)
      .addField("Channel", `<#${oldState.channel.id}> ▶️ <#${newState.channel.id}>`)
      .addField("Users", stripIndents`
      > <@${oldState.member.user.id}>(${oldState.member.user.id})
      > <#${oldState.channel.id}>(${oldState.channel.id}))`)
      .setFooter(client.user.username + " Logs")
      
      client.channels.cache.get(logChannelId).send({ embeds: [auditEmbed]})
    }
  })

client.on("inviteCreate", async(invite) => {
  //console.log(invite)
  const data = await logsSchema.findOne({
    guild: invite.guild.id,
  })
  let logChannelId
  if(data) {
    logChannelId = data.channel
  } else {
    return;
  }
  
  let auditEmbed = new MessageEmbed()
  .setColor("BLUE")
  .setAuthor(invite.inviter.username, invite.inviter.displayAvatarURL({ dynamic: true }))
  .addField("📎 Invite created", `<#${invite.channel.id}>`)
  .addField("Invite code", invite.code)
  .addField("Date", `${new Date().toLocaleString()}`)
  .addField("Users", `<@${invite.inviter.id}>(${invite.inviter.id})`)
  .setFooter(client.user.username + " Logs")
  client.channels.cache.get(logChannelId).send({ embeds: [auditEmbed]})
  
})

client.on("channelCreate", async(channel) => {
   const data = await logsSchema.findOne({
    guild: channel.guild.id,
  })
  let logChannelId
  if(data) {
    logChannelId = data.channel
  } else {
    return;
  }
  
  const auditEmbed = new MessageEmbed()
  .setColor("BLUE")
  .addField("📩 Channel created", `<#${channel.id}>`)
  .addField("Channel name", channel.name)
  .addField("Channel id", channel.id)
  .addField("IDs", `> <#${channel.id}>(${channel.id})`)
  .setFooter(client.user.username + " Logs")
  client.channels.cache.get(logChannelId).send({ embeds: [auditEmbed]})
})

client.on("channelDelete", async(channel) => {
   const data = await logsSchema.findOne({
    guild: channel.guild.id,
  })
  let logChannelId
  if(data) {
    logChannelId = data.channel
  } else {
    return;
  }
  
  const auditEmbed = new MessageEmbed()
  .setColor("BLUE")
  .addField("📩 Channel deleted", `#${channel.name} <#${channel.id}>`)
  .addField("Channel name", channel.name)
  .addField("Channel id", channel.id)
  .addField("IDs", stripIndents`
  > <#${channel.id}>(${channel.id})`)
  .setFooter(client.user.username + " Logs")
  client.channels.cache.get(logChannelId).send({ embeds: [auditEmbed]})
})


client.on("channelUpdate", async(oldChannel, newChannel) => {
  const data = await logsSchema.findOne({
    guild: oldChannel.guild.id,
  })
  let logChannelId
  if(data) {
    logChannelId = data.channel
  } else {
    return;
  }
  
  const changes = [];
 
    if (oldChannel.name !== newChannel.name) {
        changes.push(`\`${oldChannel.name}\`  ➡️ \`${newChannel.name}\``);
      }
    
      if (oldChannel.topic !== newChannel.topic) {
        changes.push(`${oldChannel.topic || 'None'}  ➡️ ${newChannel.topic || 'None'}`);
      }
    
      if (changes.length === 0) return; 
    
      const changesText = changes.join('\n');
  
  const auditEmbed = new MessageEmbed()
  .setColor("GREEN")
  .addField("📨 Channel updated", `<#${oldChannel.id}>`)
  .addField("Changes", changesText)
  .addField("IDs", stripIndents`
  > <#${oldChannel.id}>(${oldChannel.id})`)
  .setFooter(client.user.username + " Logs")
  client.channels.cache.get(logChannelId).send({ embeds: [auditEmbed]})
})


client.on("roleCreate", async(role) => {
  const data = await logsSchema.findOne({
    guild: role.guild.id,
  })
  let logChannelId
  if(data) {
    logChannelId = data.channel
  } else {
    return;
  }
  const permissions = role.permissions.toArray().map((permission) => `${permission}`).join(', ');
  
  const auditEmbed = new MessageEmbed()
  .setColor("GREEN")
  .addField("Role created", `<@${role.id}>`)
  .addField("Role name", role.name)
  .addField("Role hex color", role.hexColor)
  .addField("Role permissions". permissions || "No permissions")
  .addField("IDs", stripIndents`
  > <@&${role.id}>(${role.id})
  
  `)
  .setFooter(client.user.username + " Logs")
  client.channels.cache.get(logChannelId).send({ embeds: [auditEmbed]})
})

client.on("roleDelete", async(role) => {
  const data = await logsSchema.findOne({
    guild: role.guild.id,
  })
  let logChannelId
  if(data) {
    logChannelId = data.channel
  } else {
    return;
  }
  
  const auditEmbed = new MessageEmbed()
  .setColor("RED")
  .addField("Role deleted", `<@${role.id}>`)
  .addField("Role name", role.name)
  .addField("Role hex color", role.hexColor)
  .addField("IDs", stripIndents`
  > @${role.name}(${role.id})
  
  `)
  .setFooter(client.user.username + " Logs")
  client.channels.cache.get(logChannelId).send({ embeds: [auditEmbed]})
})

client.on("roleUpdate", async(oldRole,newRole) => {
  const data = await logsSchema.findOne({
    guild: newRole.guild.id,
  })
  let logChannelId
  if(data) {
    logChannelId = data.channel
  } else {
    return;
  }
  let colorChanged = ""


  if (oldRole.hexColor !== newRole.hexColor) {
    colorChanged += `${oldRole.hexColor} ➡️ ${newRole.hexColor}\n`;
  }
  const oldPermissions = oldRole.permissions.toArray().map((permission) => `${permission.toLowerCase()}`).join(', ');
  const newPermissions = newRole.permissions.toArray().map((permission) => `${permission.toLowerCase()}`).join(', ');
  
  const auditEmbed = new MessageEmbed()
  .setColor("YELLOW")
  .addField("Role updated", `<@${newRole.id}>`)
  .addField("Role name", newRole.name)
  .addField("Role color changed", colorChanged || "No color changed")
  .addField("Old permissions", oldPermissions || "No permissions changed")
  .addField("New permissions", newPermissions ||  "No permissions changed")
  .addField("IDs", stripIndents`
  > <@&${newRole.id}>(${newRole.id})
  
  `)
  .setFooter(client.user.username + " Logs")
  client.channels.cache.get(logChannelId).send({ embeds: [auditEmbed]})
})

client.on('threadCreate', async (thread) => {
  const data = await logsSchema.findOne({
    guild: thread.guild.id,
  })
  let logChannelId
  if(data) {
    logChannelId = data.channel
  } else {
    return;
  }
   const auditEmbed = new MessageEmbed()
   .setColor("GREEN")
   .addField("Thread created", `<#${thread.id}>`)
   .addField("Thread name", thread.name)
   .addField("Thread ID", thread.id)
   .addField("IDs", `> <#${thread.id}>(${thread.id}>`)
   .setFooter(client.user.username + " Logs")
  client.channels.cache.get(logChannelId).send({ embeds: [auditEmbed]})
})
client.on('threadDelete', async (thread) => {
  const data = await logsSchema.findOne({
    guild: thread.guild.id,
  })
  let logChannelId
  if(data) {
    logChannelId = data.channel
  } else {
    return;
  }
   const auditEmbed = new MessageEmbed()
   .setColor("GREEN")
   .addField("Thread deleted", `${thread.name}#<#${thread.id}>`)
   .addField("Thread name", thread.name)
   .addField("Thread ID", thread.id)
   .addField("IDs", `> <#${thread.id}>(${thread.id}>`)
   .setFooter(client.user.username + " Logs")
  client.channels.cache.get(logChannelId).send({ embeds: [auditEmbed]})
})










//starboard system

client.on("messageReactionAdd", async(react) => {
  if(react.message.partial) await react.message.fetch()
  if(react.partial)await react.fetch()
  
  
  if(!react.message.guildId) return;
  
  var data = await starboardSchema.findOne({ guild: react.message.guildId })
  if(!data) return
  else {
    if(react._emoji.name !== '⭐') return
    var guild = await client.guilds.cache.get(react.message.guildId)
    var sendChannel = await guild.channels.fetch(data.channel)
    var channel = await guild.channels.fetch(react.message.channelId)
    var message = await channel.messages.fetch(react.message.id)
    
    if(message.author.id == client.user.id) return
    var newReaction = await message.reactions.cache.find(reaction => reaction.emoji.id === reaction._emoji.id)
    const messageEdit = await channel.messages.fetch(newReaction.message.id)
    var messageToEdit = await channel.messages.fetch(newReaction.message.id).then(e => e.content.length === 1 ? (e.content.startsWith(`⭐ ${newReaction.count} | ${channel}`) ? true : false) : false)
    const channel2 = await client.channels.cache.get(data.channel)
    const existMsg = await channel2.messages.fetch()
    const sentMessage = existMsg.find(msg => msg.embeds.length === 1 ? (msg.embeds[0].footer && msg.embeds[0].footer.text.startsWith(`#${channel.name} | ${message.id}`) ? true : false) : false)
    if(newReaction.count >= data.count) {
        var messageStarboard = message.content || "Embed/Attachment"
        let embed = new Discord.MessageEmbed()
        .setColor("BLUE")
        .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
        .setDescription(`${messageStarboard}`)
        .setTimestamp()
        .setFooter(`#${channel.name} | ${message.id}`)
        //.setImage(image.url)
        if(message.attachments.size > 0) {
          let image = message.attachments.first();
          embed.setImage(image.url ? image.proxyURL : null)
        }
      
         if(sentMessage) {
             const channel2 = await client.channels.cache.get(data.channel)
             const starMsg = await sendChannel.messages.fetch(sentMessage.id);
             await starMsg.edit({ content: `⭐️ ${newReaction.count} ${channel} (${message.id})` })
            //await sendChannel.send({ content: `⭐ ${newReaction.count} | ${channel}`, embeds: [embed]})

         } 
        if(!sentMessage) {
          const ButtonMessage = new Discord.MessageButton()
          .setLabel("Jump To Message")
          .setURL(`https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`)
          .setStyle("LINK")
          const compoMessage = new Discord.MessageActionRow().addComponents(ButtonMessage)
            await sendChannel.send({ content: `⭐ ${newReaction.count} ${channel} (${message.id})`, embeds: [embed], components: [compoMessage]})
            
         }
    }
  }
})







//starboard system






//bug reporrt

client.on("interactionCreate", async interaction => {
  const DataSampLive = await sampLive.findOne({ guild: interaction.guild.id }).catch(e => {})
   if(!interaction.guild || !interaction.isModalSubmit()) return
  
   if(interaction.customId === "report") {
       const cmd = interaction.fields.getTextInputValue("type")
       const description = interaction.fields.getTextInputValue("description")
       
       
       const id = interaction.user.id
       const member = interaction.member
       const server = interaction.guild
       
       const channel = await client.channels.cache.get("1268579740877455360")
       
       
       const embed = new Discord.MessageEmbed()
       .setColor("BLUE")
       .setAuthor(member.user.username, member.user.displayAvatarURL({ dynamic: true}))
       .setTitle("📄 New Report!")
       .addField("From Member", member.user.username)
       .addField("From Guild", `${server.name} (\`${server.id}\`)`)
       .addField("Problematic Features", cmd)
       .addField("Report Description", description)
       .setTimestamp()
       
       await channel.send({ embeds: [embed]})
       await interaction.reply({ content: `🧾 Your report has been recorded, our developers will look into this issues. Thank you`, ephemeral: true})
     
  } else  if(interaction.customId === "suggest") {
       const cmd = interaction.fields.getTextInputValue("suggestType")
       const description = interaction.fields.getTextInputValue("descriptionSuggest")
       
       
       const id = interaction.user.id
       const member = interaction.member
       const server = interaction.guild
       
       const channel = await client.channels.cache.get("1270807236624777330")
       
       
       const embed = new Discord.MessageEmbed()
       .setColor("BLUE")
       .setAuthor(member.user.username, member.user.displayAvatarURL({ dynamic: true}))
       .setTitle("📄 New Suggestion!")
       .addField("From Member", member.user.username)
       .addField("From Guild", `${server.name} (\`${server.id}\`)`)
       .addField("Suggest", cmd)
       .addField("Description", description)
       .setTimestamp()
       
       await channel.send({ embeds: [embed]})
       await interaction.reply({ content: `🧾 Your suggestion has been recorded. Thank you`, ephemeral: true})
     
  } else if(interaction.customId === `updt-${interaction.user.id}`) {
      const LastFmUser = require("./models/lastfm")
      const newUsername = interaction.fields.getTextInputValue(`username-${interaction.user.id}`)
      await LastFmUser.findOneAndUpdate({ id: interaction.user.id, lastFmUsername: newUsername})
      await interaction.reply({ content: `**${newUsername}** Your Last.fm username has been updated!`, ephemeral: true})
  } else if(interaction.customId === `channelchange-${DataSampLive.guild}`) {
    const channelID = interaction.fields.getTextInputValue(`channelID-${DataSampLive.guild}`)
    const channelGet = await client.channels.cache.get(channelID)
    const data = await sampLive.findOne({ guild: interaction.guild.id })
    const dataSamp = await sampServer.findOne({ guild: interaction.guild.id })
    const channelLive = await client.channels.cache.get(data.channel)
    const messages = await channelLive.messages.fetch()
    const sentMessage = messages.find(msg => msg.embeds.length === 1 ? (msg.embeds[0].footer && msg.embeds[0].footer.text.startsWith(`Samp Live Status | ${data.channel}`) ? true : false) : false)
    if(!channelGet) return interaction.reply({ content: ":x: This is not a valid text channel", ephemeral: true})
    if(channelGet.type === "GUILD_VOICE") return interaction.reply({ content:"Please provide a valid text channel", ephemeral: true})
    if(channelGet.type === "GUILD_CATEGORY") return interaction.reply({ content:"Please provide a valid text channel", ephemeral: true})
    
    if(sentMessage) {
        const messageToDelete = await channelLive.messages.fetch(sentMessage.id)
        const Embed = new Discord.MessageEmbed()
        .setColor("YELLOW")
        .setDescription("-# channel has been changed")
        await messageToDelete.edit({ embeds: [Embed], components: []})
    }
    data.channel = channelGet.id
    await data.save()
    await interaction.reply({ content: `📗 The channel has been updated! <#${channelGet.id}>`, ephemeral: true})
    let options2 = {
        host: dataSamp.ip,
        port: dataSamp.port
    };
      const select = new Discord.MessageSelectMenu()
      .setCustomId(`settings-${interaction.guild.id}`)
      .setPlaceholder("Settings")
      .addOptions([
        {
          label: "Delete",
          value: `delete-${data.guild}`,
          description: "Delete samp live status in this server"
        },
        {
          label: "Change Channel",
          value: `updatechannel-${data.guild}`,
          description: "To change the channel"
        },
        {
          label: "Update Ip and Port",
          value: `updateip-port-${data.guild}`,
          description: "Update the ip and port"
        },
         {
          label: "Information",
          value: `information-${data.guild}`,
          description: "Samp live status information"
        }
      ])
      const selectRow = new Discord.MessageActionRow().addComponents(select)
      const sentEmbed = new Discord.MessageEmbed()
      .setColor("BLUE")
      samp(options2, async function(err, state) {
        if (err) {
          sentEmbed.setDescription("Server is offline")
      } else if (state) {
        let playerslst = state.players.map(
          e => `\`${e.id} :   ${e.name.replace("_", " ")}  :   ${e.ping} ms\``
        );
        if (playerslst === false) playerslst = "** **"
        sentEmbed.setTitle(state.hostname)
        sentEmbed.setTimestamp()
        sentEmbed.setDescription(stripIndents`
      [ ${state.online} Players Online ]
      
      
      [  ID  : Players Name  : Players Ping  ]
        ${playerslst.join("\n")}`)
        sentEmbed.setFooter(`Samp Live Status | ${data.channel}`)
       }
        client.channels.cache.get(data.channel).send({ embeds: [sentEmbed], components: [selectRow]})
     })
  } else if(interaction.customId === `ipport-${DataSampLive.guild}`) {
    const ip = interaction.fields.getTextInputValue(`ip-${DataSampLive.guild}`)
    const port = interaction.fields.getTextInputValue(`port-${DataSampLive.guild}`)
    const data = await sampServer.findOne({ guild: interaction.guild.id })
    if(!data) return interaction.reply({ content: ":x: Could not find any data on this server", ephemeral: true })
    
    data.ip = ip
    data.port = port
    await data.save()
    await interaction.reply({ content: `Ip and port changed to \`\`\`${ip}:${port}\`\`\``, ephemeral: true})
  }
})


//selectMenu


client.on("interactionCreate", async interaction => {
  const data = await sampLive.findOne({ guild: interaction.guild.id })
  if(!data) return
  const channelLive = await client.channels.cache.get(data.channel)
  const messages = await channelLive.messages.fetch()
  const sentMessage = messages.find(msg => msg.embeds.length === 1 ? (msg.embeds[0].footer && msg.embeds[0].footer.text.startsWith(`Samp Live Status | ${data.channel}`) ? true : false) : false)
  if(!interaction.isSelectMenu()) return
  
  if(interaction.customId === `settings-${data.guild}`) {
    if(interaction.values[0] === `delete-${data.guild}`) {
      if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ content: ":x: You do not have a permission to do this", ephemeral: true })
      const data2 = await sampLive.findOne({ guild: interaction.guild.id })
      if(!data2) return interaction.reply({ content: ":x: Data already deleted", ephemeral: true })
      //await sampLive.deleteMany({ guild: interaction.guild.id })
      //await interaction.reply({ content: "✅ Samp live status has been deleted on this server", ephemeral: true})
      if(sentMessage) {
        const messageToDelete = await channelLive.messages.fetch(sentMessage.id)
        const Embed = new Discord.MessageEmbed()
        .setColor("YELLOW")
        .setDescription("-# live status of samp was deleted by admin, this embed will be deleted in 5 seconds")
        await messageToDelete.edit({ embeds: [Embed], components: []})
        setTimeout(async function() {
          messageToDelete.delete()
          await sampLive.deleteMany({ guild: interaction.guild.id })
        }, 5*1000)
      }
      if(!sentMessage) return
    }
    if(interaction.values[0] === `updatechannel-${data.guild}`) {
      if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ content: ":x: You do not have a permission to do this", ephemeral: true })
      const data2 = await sampLive.findOne({ guild: interaction.guild.id })
      if(!data2) return interaction.reply({ content: ":x: Data already deleted", ephemeral: true})
      
      const modal = new Discord.Modal()
      .setCustomId(`channelchange-${data2.guild}`)
      .setTitle("Provide a valid text channel id")
      
      const channelID = new Discord.TextInputComponent()
      .setCustomId(`channelID-${data2.guild}`)
      .setStyle("SHORT")
      .setPlaceholder("A valid text channel ID")
      .setLabel("Channel ID")
      .setRequired(true)
      
      const compo = new Discord.MessageActionRow().addComponents(channelID)
      modal.addComponents(compo)
      await interaction.showModal(modal)

    }
    if(interaction.values[0] === `information-${data.guild}`) {
      const data2 = await sampServer.findOne({ guild: interaction.guild.id })
      const data3 = await sampLive.findOne({ guild: interaction.guild.id })
      if(!data3) return interaction.deferUpdate()
      if(!data2) return interaction.deferUpdate()
      const EmbedServer = new MessageEmbed()
      .setColor("GREEN")
      .setDescription(`\`\`\`${data2.ip}:${data2.port}\`\`\``)
      .addField("Status", "ON")
      .addField("Channel", `<#${data3.channel}>`)
      .setTimestamp()
      await interaction.reply({ embeds: [EmbedServer], ephemeral: true})
    }
    if(interaction.values[0] === `updateip-port-${data.guild}`) {
      if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ content: ":x: You do not have a permission to do this", ephemeral: true })
      const data2 = await sampLive.findOne({ guild: interaction.guild.id })
      if(!data2) return interaction.reply({ content: ":x: Data already deleted", ephemeral: true})
      
      const modal = new Discord.Modal()
      .setCustomId(`ipport-${data2.guild}`)
      .setTitle("Ip:Port change")
      
      const ip = new Discord.TextInputComponent()
      .setCustomId(`ip-${data2.guild}`)
      .setStyle("SHORT")
      .setPlaceholder("Enter an ip address")
      .setLabel("Ip Address")
      .setRequired(true)
      const port = new Discord.TextInputComponent()
      .setCustomId(`port-${data2.guild}`)
      .setStyle("SHORT")
      .setPlaceholder("A port")
      .setLabel("Port")
      .setRequired(true)
      
      const compo = new Discord.MessageActionRow().addComponents(ip)
      const compo2 = new Discord.MessageActionRow().addComponents(port)
      modal.addComponents(compo, compo2)
      await interaction.showModal(modal)
      
    }
  }


})




//tiktok

client.on("messageCreate", async (message) => {
	console.log(`Message received: ${message.content}`);

	if (message.author && message.author.bot) return;

	const tiktokRegex = /(https?:\/\/)?(www\.)?(tiktok\.com\/\S+\/?)/g; 
    const tiktokRegex2 = /(https?:\/\/)?(vt\.)?(tiktok\.com\/\S+\/?)/g; 
	const content = message.content;

	const matches = content.match(tiktokRegex, tiktokRegex2);
	if (matches) {
		const firstLink = matches[0];

		let editedContent = firstLink.replace(/tiktok\.com/g, "tnktok.com");

		try {
			//await message.delete(); 
      if(!editedContent.includes("https://")) editedContent = "https://"+editedContent

			await message.channel.send({ content: `${editedContent}`});
			//console.log(`Replied with: ${editedContent}`);
		} catch (error) {
			//console.error(`Failed to send message or delete: ${error.message}`); 
		}
	}
});







//voice join to create

const voiceSchema = require("./models/voiceSchema")
const voiceSchemaChannel = require("./models/voice")
client.on("voiceStateUpdate", async (oldState, newState) => {
    try {
        if(newState.member.guild === null) return
    } catch(e) {
        return
    }
    const joinData = await voiceSchema.findOne({ guild: newState.member.guild.id })
    const joinDataChannel = await voiceSchemaChannel.findOne({ user: newState.member.id })
    const voiceChannel = newState.channel
    
    if(!joinData) return
    if(!voiceChannel) return
    
    else {
        if(voiceChannel.id === joinData.channel) {
            try {
                const channel = await newState.member.guild.channels.create(`🎙️║ ${newState.member.user.username}'s・voice`,{
                    type: "GUILD_VOICE",
                    parent: joinData.category
                })
                try {
                    await newState.member.voice.setChannel(channel.id)
                } catch(e) {
                    return
                }
                    await voiceSchemaChannel.create({
                        user: newState.member.id,
                        channel: channel.id,
                        userLimit: 0
                    })
              
            } catch(e) {
                return
            }
        } else {
            return
        }
    }
})


client.on("voiceStateUpdate", async (oldState, newStae) => {
    
    if(oldState.member.guild === null) return
    
    const leaveChannel = await voiceSchemaChannel.findOne({ user: oldState.member.id })
    if(!leaveChannel) return
    const members = oldState.channel?.members
            .filter((m) => !m.user.bot)
            .map((m) => m.id);
    
        const voiceChannel = await oldState.member.guild.channels.cache.get(leaveChannel.channel)
        try {
            if(members.length > 0) {
              let randomID = members[Math.floor(Math.random() * members.length)];
              let randomMember = oldState.guild.members.cache.get(randomID);
              await voiceSchemaChannel.deleteMany({ user: leaveChannel.user})
              console.log(members)
              await voiceSchemaChannel.create({
                user: randomID,
                channel: oldState.channel.id,
                userLimit: 0
              })
                
            } else {
              await voiceChannel.delete()
              await voiceSchemaChannel.deleteMany({ user: oldState.member.id})
            }
        } catch(e) {
            return
        }
})


//










//bug report

client.banners = discordBanners
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.cooldown = new Discord.Collection();
client.events = new Discord.Collection();
client.slashCommands = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {
    if (err) return console.log(err);
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        let props = require(`./commands/${file}`);
        console.log("✅ | Successfully loaded [" + file+"]")
        let commandName = file.split(".")[0];
        client.commands.set(commandName, props);
        if(props.aliases) {
            props.aliases.forEach(alias => {
                client.aliases.set(alias, props)
            })
        }
    });
});
    fs.readdir('./events/', (err, files) => {
        if (err) console.log(err);
        files.forEach(file => {
            let eventFunc = require(`./events/${file}`);
            console.log("✅ | Successfully loaded [" + file+"]")
            let eventName = file.split(".")[0];
            client.on(eventName, (...args) => eventFunc.run(client, ...args));
        });
});

const handlers = readdirSync("./handler/").filter((f) => f.endsWith(".js"));

handlers.forEach((hanlder) => {
  require(`./handler/${hanlder}`)(client);
});







// error handling
const channelCrash = "1269726419127242842"
  process.on("unhandledRejection", (reason, p) => {
 
    console.log(reason, p);
  });
  process.on("uncaughtException", (err, origin) => {
  
    //console.log(" [antiCrash] :: Uncaught Exception/Catch");
    console.log(err, origin);
  });
  process.on("uncaughtExceptionMonitor", (err, origin) => {
      
    console.log(err, origin);
  });
  process.on("multipleResolves", (type, promise, reason) => {
    console.log(" [antiCrash] :: Multiple Resolves");
  });

process.on("uncaughtReferenceError", (err) => {
    console.log(" [antiCrash] :: Uncaught Reference Error");
  });


//error handling







client.login("MTMyNTEwODk3NTI1NDkwMDc5OA.G7xnhD.FOL0Sv5Bb7Bzj_aOeaO1IszABwe12zB2h_s_s8")

module.exports.client = client




function messageLimit(str) {
  if (str.length > 1000) {
      return str.substring(0, 1001) + '...';
  } else {
      return str;
  }
}