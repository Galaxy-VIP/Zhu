const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js")
const { stripIndents } = require("common-tags")
const { connection } = require('mongoose')
const { progressBar } = require('../../bar')
const formatResults = require('../../formatResults')
const wait = require("node:timers/promises").setTimeout
const os = require("os")
module.exports = {
  name: "stats",
  description: "Stats",
  execute: async (client, interaction, args) => {
    const owner = client.users.cache.get("799184292190093312")
    const owner2 = client.users.cache.get("1005082777206661190")
    let users = 0
    client.guilds.cache.map(e => users = users + (e.memberCount))
    if(users >= 1000) {
      users = `${(users/1000).toFixed(1)}k`
    }
    if(users >= 1000000) {
      users = `${(users/1000000).toFixed(1)}m`
    }
    let usersCached = client.users.cache.size
    if(usersCached >= 1000) {
      usersCached = `${(usersCached/1000).toFixed(1)}k`
    }
    if(usersCached >= 1000000) {
      usersCached = `${(usersCached/1000000).toFixed(1)}m`
    }
    
    let memoryUsed = process.memoryUsage().heapUsed / 1024 / 1024 * 100 / 100
    let memoryTotal = process.memoryUsage().heapTotal / 1024 / 1024 * 100 / 100
    let memoryUsed2 = process.memoryUsage().heapUsed
    let memoryTotal2 = process.memoryUsage().heapTotal
    let up = (Date.now() / 1000 - client.uptime / 1000).toFixed()
    const statsEmbed = new MessageEmbed()
    .setColor("BLUE")
    .setDescription(stripIndents`
    **General Information**
   > Dev: \`${owner.username}, ${owner2.username}\`
   > Server: \`${client.guilds.cache.size.toLocaleString()}\`
   > Users: \`${users}\` (\`${usersCached}\` Cached)
   > Commands: \`${client.commands.size}\`
   > Memory: ${formatResults(`${memoryUsed2}`, `${memoryTotal2}`)}
   > Database: \`${databaseConnection(connection.readyState)}\`
   > Uptime: \`${require("ms")(client.uptime)}\`\n> ** ** ** ** ** ** ** ** Up Since: <t:${up}:R>
   **System** 
   > Library: Discord.js (\`${require("discord.js").version}\`)
   > Database: Mongoose (\`${require("mongoose").version}\`)
   > Node.js: \`${process.version}\`
   > Websocket: \`${client.ws.ping.toFixed(1)}\``)
    .setAuthor(client.user.username, client.user.displayAvatarURL())
    await interaction.deferReply()
    await wait(3000)
    await interaction.editReply({ embeds: [statsEmbed]})
  }
}

function databaseConnection(val) {
  var status = " ";
  switch(val) {
    case 0 : status = "🔴 Disconnected"
      break;
    case 1 : status = "🟢 Connected"
      break;
    case 2 : status = "🟡 Connecting"
      break;
    case 3 : status = "🟠 Disconnecting"
      break;
  }
  return status
}