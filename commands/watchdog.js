const { MessageEmbed } = require("discord.js")
const {stripIndents} = require("common-tags")
module.exports = {
  name: "Watch Dog Stats", 
  aliases: ["wds", "watchdogstats"],
  run: async (client, msg, args) => {
    const wait = await msg.channel.send("<a:load:801079850054975488> " + await "Collecting watch dog stats data please wait")
    
    client.hypixel.getWatchdogStats().then(wb => {
      const embed = new MessageEmbed()
      .setColor("YELLOW")
      .setTitle("<:emoji_35:803804845718372362> Watch Dog Stats")
      .setDescription(stripIndents`
      》By Watch Dog Total: **${wb.byWatchdogTotal.toLocaleString()}**
      》By Watch Dog Rolling Day: **${wb.byWatchdogRollingDay.toLocaleString()}**
      》By Watch Dog Last Minute: **${wb.byWatchDogLastMinute}**
      》By Staff Total: **${wb.byStaffTotal.toLocaleString()}**
      》By Staff Rolling Day: **${wb.byStaffRollingDay.toLocaleString()}**`)
      .setTimestamp()
      setTimeout(async function() {
        wait.edit("✅ " + await "Getting data watch dog hypixel")
        wait.edit({ embeds: [embed] })
      }, 3000)
    })
  }
}
