const { MovieDb } = require('moviedb-promise')
const moviedb = new MovieDb(process.env.MOVIE_KEY)
const { stripIndents } = require('common-tags')
const Discord = require('discord.js')
const { MessageButton, MessageActionRow } = require("discord.js")

module.exports = {
  name: "movie",
  cooldown: 5,
  run: async (client, msg, args) => {
    const message = msg
    let movieName = args.join(" ")
    if(!movieName) return msg.channel.send({ content: 'Please provide something to search' })
    moviedb.searchMovie({
      query: movieName
    }).then(async res => {
      
      let i0 = 10
      let i1 = 10
      let page = 1
      let pageMovie = 0
      let lastPage = res.results.length - 1
      
      const pages = (page) => {
        return new MessageActionRow().addComponents(
        new MessageButton()
        .setCustomId("previous_button")
        .setEmoji("⬅️")
        .setDisabled(page < 2)
        .setStyle("PRIMARY"),
        new MessageButton()
        .setCustomId("next_button")
        .setEmoji("➡️")
        .setDisabled(!(page < lastPage ))
        .setStyle("PRIMARY")
      )
    }
      let dis = new MessageActionRow().addComponents(
      new MessageButton()
      .setCustomId("previous_button")
      .setEmoji("⬅️")
      .setDisabled(true)
      .setStyle("PRIMARY"),
      new MessageButton()
      .setCustomId("next_button")
      .setEmoji("➡️")
      .setDisabled(true)
      .setStyle("PRIMARY")
      )
       
      let result = res.results
      let imageUrl = `https://image.tmdb.org/t/p/original`
      let image = result[0].backdrop_path
      if(image === null) image = result[0].poster_path
      const embed = new Discord.MessageEmbed()
      .setColor("ORANGE")
      .setAuthor(result[0].title, imageUrl+image)
      .setThumbnail('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRERFklWD4Rw6GfYosUBab6Y3hwam7vYIiXNQ&usqp=CAU')
      .setDescription(stripIndents`
      **${result[0].overview}**
      
      Name: **${result[0].title}**
      Movie ID: **${result[0].id}**
      Release: **${result[0].release_date ? result[0].release_date : "???"}**
      Popularity: **${result[0].popularity}**
      Vote: **${result[0].vote_count}**
      Vote Average: **${result[0].vote_average}**
      `)
      .setImage(`https://image.tmdb.org/t/p/original${image}`)
      .setFooter(`Page [${page}/${Math.ceil(lastPage)}] Movie Database`)
      .setTimestamp()
      
      if(res.results.length < lastPage) {
        return msg.channel.send({ embeds: [embed], components: [dis] })
      }
      
      let m = await msg.channel.send({ embeds: [embed], components: [pages(page)] })
      
       let collector = m.createMessageComponentCollector({ componentType: "BUTTON", time: 90 * 1000})
       collector.on("collect", async (i) => {
         try {
           if(i.user.id) {
             if(i.customId === "previous_button") {
               i0 = i0 - 10
               i1 = i1 - 10
               page = page - 1
               pageMovie = - 1
               embed.setImage(imageUrl+result[page].backdrop_path)
               //embed.setImage(`attachment://image-${page}/${Math.ceil(lastPage)}.png`)
               embed.setAuthor(result[page].title, imageUrl+result[page].backdrop_path)
               embed.setDescription(stripIndents`
               **${result[page].overview}**
               
               Name: **${result[page].title}**
               Movie ID: **${result[page].id}**
               Release: **${result[page].release_date ? result[page].release_date : "???"}**
               Popularity: **${result[page].popularity}**
               Vote: **${result[page].vote_count}**
               Vote Average: **${result[page].vote_average}**
               `)
               let imageMovie = new Discord.MessageAttachment(imageUrl+result[page], `image-${page}/${Math.ceil(lastPage)}.png`)
               embed.setFooter(`Page [${page}/${Math.ceil(lastPage)}] Movie Database`)
                m.edit({ embeds: [embed], components: [pages(page)]})
               
         } else if(i.customId === "next_button") {
               i0 = i0 + 10
               i1 = i1 + 10
               page = page + 1
               pageMovie = pageMovie + 1
               let imageMovie = new Discord.MessageAttachment(imageUrl+result[page], `image-${page}/${Math.ceil(lastPage)}.png`)
               embed.setImage(imageUrl+result[page].backdrop_path)
               //embed.setImage(`attachment://image-${page}/${Math.ceil(lastPage)}.png`)
               embed.setAuthor(result[page].title, imageUrl+result[page].backdrop_path)
               embed.setDescription(stripIndents`
               **${result[page].overview}**
               
               Name: **${result[page].title}**
               Movie ID: **${result[page].id}**
               Release: **${result[page].release_date ? result[page].release_date : "???"}**
               Popularity: **${result[page].popularity}**
               Vote: **${result[page].vote_count}**
               Vote Average: **${result[page].vote_average}**
               `)
               embed.setFooter(`Page [${page}/${Math.ceil(lastPage)}] Movie Database`)
                 m.edit({ embeds: [embed], components: [pages(page)]})
         }
           } else {
             return i.deferUpdate()
           }
           
         } catch(e) {
           return
         }
       })
      collector.on('end', async (i) => {
      try {
        embed.setFooter("[TIMED OUT] Movie Database")
        m.edit({ embeds: [embed], components: []})
      } catch(e) {
        return
      }
      })
    }).catch(e => msg.channel.send({ content: '404 Not Found'}))
  }
}