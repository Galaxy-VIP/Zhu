const mojang = require("mojangjs")
const { MessageEmbed } = require("discord.js")
const {stripIndents} = require("common-tags")
module.exports = {
  name: "Hypixel Boosters",
  run: async (client, msg, args) => {
    client.hypixel.getBoosters().then(async m => {
    let i0 = 0
    let i1 = 20
    let result = m.map((opt,i) => (`${i+1} • Game: \`${opt.game.toString()}\`` + `purchased by: `+ opt.purchaser)).slice(0, 20).join("\n")
    console.log(result)
    const test2 = await mojang.getNameFromUUID(m[1].purchaser)
    const test = await mojang.getNameFromUUID(m[0].purchaser)
    const embed = new MessageEmbed()
    .setColor("BLUE")
    .setTitle("<:emoji_35:803804845718372362> Hypixel Boosters Queue")
    .setDescription(result)
    .setFooter("Hypixel")
    .setTimestamp()
    const x = await msg.channel.send("<a:load:801079850054975488> " + await "Getting data... (10%)")
    
    setTimeout(async function() {
      x.edit("<a:load:801079850054975488> " + await "Getting data... (20%)")
    }, 3000)
    setTimeout(async function() {
      x.edit("<a:load:801079850054975488> " + await "Getting data... (40%)")
    }, 4000)
    setTimeout(async function() {
      x.edit("<a:load:801079850054975488> " + await "Getting data... (70%)")
    }, 5000)
    setTimeout(async function() {
      x.edit("<a:load:801079850054975488> " + await "Getting data... (100%)")
    }, 8000)
    setTimeout(async function() {
      x.edit(`✅ ` + await `Successfully load data (${m.length} / ${m.length})`)
      x.edit({embeds: [embed]})
    }, 9000)
    })
  }
}