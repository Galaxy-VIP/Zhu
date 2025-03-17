const axios = require('axios')
const { MessageEmbed, Util } = require('discord.js')

module.exports = {
  name: 'chat-gpt',
  description: 'Get AI response from ChatGPT AI',
  options: [
    {
      name: "prompt",
      required: true,
      type: "STRING",
      description: "Ask something to Chat GPT"
    }
  ],
  execute: async(client, interaction, args) => {
    const prompt = await interaction.options.getString("prompt")
    await interaction.reply({ content: 'Loading your response... this could take some time'})
    const Data = await axios.get(`https://api.ryzendesu.vip/api/ai/v2/chatgpt?text=${encodeURIComponent(prompt)}&prompt=`).then(async response => {
      const embed = new MessageEmbed()
      .setColor("BLUE")
      .setTitle("Response")
      .setDescription(messageLimit(response.data.response))
      .setTimestamp()
      
      setTimeout(async () => {
      
          
        const Response = response.data.response
        let chunks = await Util.splitMessage(response.data.response)
        if(chunks.length > 1) {
          chunks.forEach(async (chunk, i) => {
        
          const Embed = new MessageEmbed()
        
          .setColor("BLUE")
          .setTitle("Response")
          .setTimestamp()
          .setFooter(`Part ${i + 1} / ${chunks.length}`)
          .setDescription(chunk)
          await interaction.channel.send({ embeds: [Embed] })
          console.log(response.data.response)
          })
          
        } else {
           const Embed2 = new MessageEmbed()
           .setColor("BLUE")
           .setDescription(chunks[0])
           .setTimestamp()
           .setTitle("Response")
           await interaction.editReply({ embeds: [Embed2]})
          }
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