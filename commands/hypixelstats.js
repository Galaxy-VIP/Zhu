const { MessageEmbed } = require("discord.js")
const {stripIndents} = require("common-tags")
module.exports = {
  name: "Hypixel Stats",
  description: "Show stats player",
  aliases: ["hystats"],
  run: async (client, msg, args) => {
    
    const args1 = new MessageEmbed()
    .setColor("RED")
    .setTitle("Stats Synxtax")
    .setDescription(stripIndents`
    Valid Syntax: \`<mode> <playername>\` There's alot of different modes that are listed below
    Modes Available: \`Bedwars, Skywars, BuildBattle, UHC\``)
    .setFooter("Skipper 2021")
    
    if(!args[0]) return  msg.channel.send({ embeds: [args1]})

    if(!args[1]) msg.channel.send({ embeds: [args1]})
    
    if(args[0] == "bedwars" || args[0] == "bw" || args[0] == "Bedwars"){
      client.hypixel.getPlayer(args[1]).then(async m => {
        if(m.isOnline === false) m.isOnline = "**Offline**"
        if(m.isOnline === true) m.isOnline = "**Online**"
        const bed = m.stats
        const bedembed = new MessageEmbed()
        .setColor("BLUE")
        .setAuthor(`Bedwars Stats » ${args[1]}`, `https://visage.surgeplay.com/head/${m.uuid}`)
        .setThumbnail(`https://visage.surgeplay.com/bust/${m.uuid}`)
        .addField("》General Information", stripIndents`
        • Player: **[${bed.bedwars.level}✫] [${m.rank}] ${args[1]}**
        • Status: ${m.isOnline}
        • Total Games: **${bed.bedwars.playedGames}**
        • Wins : **${bed.bedwars.wins}**
        • Kills: **${bed.bedwars.kills}**
        • Losses: **${bed.bedwars.losses}**
        • Final Kills: **${bed.bedwars.finalKills}**
        • Coins: **${bed.bedwars.coins}**
        • KDR: **${bed.bedwars.KDRatio}**`)
        .addField("》Solo", stripIndents`
        • Played Games: **${bed.bedwars.solo.playedGames}**
        • Winstreak: **${bed.bedwars.solo.winstreak}**
        • Kills: **${bed.bedwars.solo.kills}**
        • Final Kills: **${bed.bedwars.solo.finalKills}**
        • Losses: **${bed.bedwars.solo.losses}**
        • Beds Broken: **${bed.bedwars.solo.beds.broken}**`)
        .addField("》Doubles", stripIndents`
        • Played Games: **${bed.bedwars.doubles.playedGames}**
        • Winstreak: **${bed.bedwars.doubles.winstreak}**
        • Kills: **${bed.bedwars.doubles.kills}**
        • Final Kills: **${bed.bedwars.doubles.finalKills}**
        • Losses: **${bed.bedwars.doubles.losses}**
        • Beds Broken: **${bed.bedwars.doubles.beds.broken}**`)
        .addField("》3v3v3v3", stripIndents`
        • Played Games: **${bed.bedwars.three.playedGames}**
        • Winstreak: **${bed.bedwars.three.winstreak}**
        • Kills: **${bed.bedwars.three.kills}**
        • Final Kills: **${bed.bedwars.three.finalKills}**
        • Losses: **${bed.bedwars.three.losses}**
        • Beds Broken: **${bed.bedwars.three.beds.broken}**`)
        .addField("》4v4v4v4", stripIndents`
        • Played Games: **${bed.bedwars.four.playedGames}**
        • Winstreak: **${bed.bedwars.four.winstreak}**
        • Kills: **${bed.bedwars.four.kills}**
        • Final Kills: **${bed.bedwars.four.finalKills}**
        • Losses: **${bed.bedwars.four.losses}**
        • Beds Broken: **${bed.bedwars.four.beds.broken}**`)
        .addField("》4v4", stripIndents`
         • Played Games: **${bed.bedwars.fourV2.playedGames}**
         • Winstreak: **${bed.bedwars.fourV2.winstreak}**
         • Kills: **${bed.bedwars.fourV2.kills}**
         • Final Kills: **${bed.bedwars.fourV2.finalKills}**
         • Losses: **${bed.bedwars.fourV2.losses}**
         • Beds Broken: **${bed.bedwars.fourV2.beds.broken}**`)
        return msg.channel.send({embeds: [bedembed]})
      }).catch(async e => {
        console.log(e)
        return msg.channel.send({ content: 'Player not found'})
    })
    }
    else if(args[0] == "skywars" || args[0] == "sw" || args[0] == "Skywars"){
      client.hypixel.getPlayer(args[1]).then(async s => {
        if(s.isOnline === true) s.isOnline = "**Online**"
        if(s.isOnline === false) s.isOnline = "**Offline**"
        const sw = s.stats
        const swembed = new MessageEmbed()
        .setColor("BLUE")
        .setAuthor(`Skywars Stats » ${args[1]}`, `https://visage.surgeplay.com/head/${s.uuid}`)
        .setThumbnail(`https://visage.surgeplay.com/bust/${s.uuid}`)
        .addField("》General Information", stripIndents`
        • Player: **[${sw.skywars.level}✫] [${s.rank}] ${args[1]}**
        • Status: ${s.isOnline}
        • Coins: **${sw.skywars.coins}**
        • Total Games: **${sw.skywars.playedGames}**
        • Kills: **${sw.skywars.kills}**
        • KDR: **${sw.skywars.KDRatio}**`)
        .addField("》Solo Normal", stripIndents`
        • Wins: **${sw.skywars.solo.normal.wins}**
        • Deaths: **${sw.skywars.solo.normal.deaths}**
        • Kills: **${sw.skywars.solo.normal.kills}**
        • Losses: **${sw.skywars.solo.normal.losses}**
        • KDR: **${sw.skywars.solo.normal.KDRatio}**`)
        .addField("》Solo Insane", stripIndents`
        • Wins: **${sw.skywars.solo.insane.wins}**
        • Deaths: **${sw.skywars.solo.insane.deaths}**
        • Kills: **${sw.skywars.solo.insane.kills}**
        • Losses: **${sw.skywars.solo.insane.losses}**
        • KDR: **${sw.skywars.solo.insane.KDRatio}**`)
        .addField("》Team Normal", stripIndents`
        • Wins: **${sw.skywars.team.normal.wins}**
        • Deaths: **${sw.skywars.team.normal.deaths}**
        • Kills: **${sw.skywars.team.normal.kills}**
        • Losses: **${sw.skywars.team.normal.losses}**
        • KDR: **${sw.skywars.team.normal.KDRatio}**`)
        .addField("》Team Insane", stripIndents`
        • Wins: **${sw.skywars.team.insane.wins}**
        • Deaths: **${sw.skywars.team.insane.deaths}**
        • Kills: **${sw.skywars.team.insane.kills}**
        • Losses: **${sw.skywars.team.insane.losses}**
        • KDR: **${sw.skywars.team.insane.KDRatio}**`)
        .addField("》Ranked", stripIndents`
        • Played: **${sw.skywars.ranked.played}**
        • Wins: **${sw.skywars.ranked.wins}**
        • Kills: **${sw.skywars.ranked.kills}**
        • Losses: **${sw.skywars.ranked.losses}**
        • KDR: **${sw.skywars.ranked.KDRatio}**`)
        .addField("》Mega", stripIndents`
        • Played: **${sw.skywars.mega.played}**
        • Wins: **${sw.skywars.mega.wins}**
        • Kills: **${sw.skywars.mega.kills}**
        • Losses: **${sw.skywars.mega.losses}**
        • KDR: **${sw.skywars.mega.KDRatio}**`)
       return msg.channel.send({embeds: [swembed]})
      }).catch(async e => {
        console.log(e)
        return msg.channel.send({ content: 'Player not found'})
      })
    }
    else if(args[0] == "buildbattle" || args[0] == "bb" || args[0] == "BuildBattle"){
      client.hypixel.getPlayer(args[1]).then(async b => {
        if(b.isOnline === false) b.isOnline = "**Offline**"
        if(b.isOnline === true) b.isOnline = "**Online**"
        const bb = b.stats
        const buildembed = new MessageEmbed()
        .setColor("BLUE")
        .setThumbnail(`https://visage.surgeplay.com/bust/${b.uuid}`)
        .setAuthor(`Build Battle Stats » ${args[1]}`, `https://visage.surgeplay.com/head/${b.uuid}`)
        .addField("》General Information", stripIndents`
        • Player: **[${b.rank}] ${args[1]}**
        • Status: ${b.isOnline}
        • Played Games: **${bb.buildbattle.playedGames}**
        • Coins: **${bb.buildbattle.coins}**
        • Total Votes: **${bb.buildbattle.totalVotes}**
        • Total Wins: **${bb.buildbattle.winsTotal}**`)
        .addField("Wins", stripIndents`
        • Solo: **${bb.buildbattle.wins.solo}**
        • Team: **${bb.buildbattle.wins.team}**
        • Pro: **${bb.buildbattle.wins.pro}**
        • Guess The Build: **${bb.buildbattle.wins.gtb}**`)
        return msg.channel.send({embeds: [buildembed]})
      }).catch(async e => {
        console.log(e)
        return msg.channel.send({ content: 'Player not found'})
      })
    }
    else if(args[0] == 'uhc' || args[0] == 'UHC') {
      client.hypixel.getPlayer(args[1]).then(async h => {
        if(h.isOnline === true) h.isOnline = "**Online**"
        if(h.isOnline === false) h.isOnline = "**Offline**"
        const u = h.stats.uhc
        const uhcembed = new MessageEmbed()
        .setColor("BLUE")
        .setThumbnail(`https://visage.surgeplay.com/bust/${h.uuid}`)
        .setAuthor(`UHC Stats » ${args[1]}`, `https://visage.surgeplay.com/head/${h.uuid}`)
        .addField('》General Information', stripIndents`
        • Player: **[${u.starLevel}✫] [${h.rank}] ${args[1]}**
        • Status: ${h.isOnline}
        • Coins: **${u.coins}**
        • Score: **${u.score}**
        • Kills: **${u.kills}**
        • Wins: **${u.wins}**
        • Deaths: **${u.deaths}**`)
        .addField('》Solo', stripIndents`
        • Wins: **${u.solo.wins}**
        • Kills: **${u.solo.kills}**
        • Deaths: **${u.solo.deaths}**
        • Heads Eaten: **${u.solo.headsEaten}**`)
        .addField('》Team', stripIndents`
        • Wins: **${u.team.wins}**
        • Kills: **${u.team.kills}**
        • Deaths: **${u.team.deaths}**
        • Heads Eaten: **${u.team.headsEaten}**`)
        .addField('》Red VS Blue', stripIndents`
        • Wins: **${u.redVSblue.wins}**
        • Kills: **${u.redVSblue.kills}**
        • Deaths: **${u.redVSblue.deaths}**
        • Heads Eaten: **${u.redVSblue.headsEaten}**`)
        .addField('》Brawl', stripIndents`
        • Wins: **${u.brawl.wins}**
        • Kills: **${u.brawl.kills}**
        • Deaths: **${u.brawl.deaths}**
        • Heads Eaten: **${u.brawl.headsEaten}**`)
        .addField('》Brawl Solo', stripIndents`
        • Wins: **${u.brawlSolo.wins}**
        • Kills: **${u.brawlSolo.kills}**
        • Deaths: **${u.brawlSolo.deaths}**
        • Heads Eaten: **${u.brawlSolo.headsEaten}**`)
        .addField('》Brawl Duo', stripIndents`
        • Wins: **${u.brawlDuo.wins}**
        • Kills: **${u.brawlDuo.kills}**
        • Deaths: **${u.brawlDuo.deaths}**
        • Heads Eaten: **${u.brawlDuo.headsEaten}**`)
        return msg.channel.send({embeds: [uhcembed]})
      }).catch(async e => {
        return msg.channel.send({ content: 'Player not found'})
      })
    }
    }
}