const axios = require('axios')
const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'google-gemini',
  description: 'Get AI response from Google Gemini',
  options: [
    {
      name: "prompt",
      required: true,
      type: "STRING",
      description: "Ask something to Google Gemini"
    }
  ],
  execute: async(client, interaction, args) => {
    const prompt = await interaction.options.getString("prompt")
    await interaction.reply({ content: 'Loading your response... this could take some time'})
    const Data = await axios.get(`https://api.ryzendesu.vip/api/ai/gemini?text=${encodeURIComponent(prompt)}&prompt=`).then(async response => {
      const embed = new MessageEmbed()
      .setColor("BLUE")
      .setTitle("Response")
      .setDescription(messageLimit(response.data.answer))
      .setTimestamp()
      
      setTimeout(async () => {
        for (const i of Array(Math.ceil(response.data.answer.length/4096)).keys()) {
          const Embed = new MessageEmbed()
          .setColor("BLUE")
          .setTitle("Response")
          .setDescription(response.data.answer.substring((i*4096), (i*4096)+4096))
          .setTimestamp()
          if(i === 0) {
            await interaction.editReply({ embeds: [Embed]})
          
          } else {
            await interaction.channel.send({embeds: [Embed]})
          }
          
        }
        //await interaction.editReply({ embeds: [embed] })
      }, 25000)
    }).catch(e => {
      console.log(e)
      return interaction.editReply({ content: "Unknown error", ephemeral: true})
    })
  }
}


function messageLimit(str) {
  if (str.length > 1000) {
      return str.substring(0, 1001) + '...';
  } else {
      return str;
  }
}