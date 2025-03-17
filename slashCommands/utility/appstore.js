const {stripIndents} = require("common-tags")
const appstore = require('app-store-scraper')
const html2md = require("html2markdown")
const { progressBar } = require("../../bar")
const { MessageEmbed } = require('discord.js')
const lang = require('../../language')

module.exports = {
  name: "appstore",
  description: "Search an application by name",
  options: [
    {
      name: "search",
      description: "Please provide something to search",
      type: "STRING",
      required: true
    }
  ],
  execute: async (client, interaction, args) => {
  
    const [ query ] = args
    let msg = interaction
    try {
    appstore.search({
    term: args,
    num: 1 }).then(pl => { 
    let store;
    store = JSON.parse(JSON.stringify(pl[0]))
    const supportedDevice = store.supportedDevices.map(m => m)
    console.log(store.score)
    let embed = new MessageEmbed()
    .setColor("GREEN")
    .setAuthor(store.title, store.icon)
    .setDescription(`[${shorten(html2md(store.description))}](${store.url})`)
    .setFooter("App Store")
    .setTimestamp()
    .setImage("https://upload.wikimedia.org/wikipedia/commons/6/67/App_Store_%28iOS%29.svg")
    .setThumbnail(store.icon)
    .addField("Name", store.title)
    .addField("Developer", store.developer)
    .addField("Rated", `${store.score.toFixed(1) ? store.score.toFixed(1) : "Unknown"}`)
    .addField("Link", `[Click Here](${store.url})`)
    console.log(store.screenshots.size)
      embed.setImage(`${store.screenshots[1] ? store.screenshots[3] : "https://media.istockphoto.com/id/664407322/id/vektor/tidak-ada-fotografi-kamera-dilarang-simbol-vektor.jpg?s=1024x1024&w=is&k=20&c=MEQPzwMPZ4b79jWIgOWQhW62tcgPaHAiNqLTepM4i_0="}`)
    interaction.reply({embeds: [embed]})
  })
    }catch(e) {
      return msg.reply({ content: html2md(e.message)})
    }
  }
}

function shorten(str) {
  if (str.length > 1000) {
      return str.substring(0, 1001) + '...';
  } else {
      return str;
  }
}


function messageLimit(str) {
  if (str.length > 1000) {
      return str.substring(0, 1001) + '...';
  } else {
      return str;
  }
}
