const KEY = 'GDCs1Mm6h2z8PJ0zDKJBj9618tpwvQaSb3OQgFX5'
const { MessageEmbed } = require("discord.js")
const fetch = require("node-fetch")


module.exports = {
  name: "nasa",
  description: "Picture of the day NASA",
  execute: async (client, interaction, args) => {
    
    const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${KEY}`)
    const data = await response.json();

            if (data.error) {
                throw new Error(data.error.message);
            }

            const nasaEmbed = new MessageEmbed()
                .setColor('BLUE')
                .setTitle('NASA Astronomy Picture of the Day')
                .setImage(data.url)
                .setDescription(data.explanation)
                .setTimestamp()
                .setFooter("NASA Picture of the Day")

            interaction.reply({ embeds: [nasaEmbed] });
      }
}