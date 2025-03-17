const { MessageEmbed } = require('discord.js')
const confessSchema = require('../../models/confessionUser')
module.exports = {
    name: "confession-blacklist",
    description: "Blacklist user",
    permission: "MANAGE_SERVERS",
    options: [ 
        {
        name: 'id',
        type: "STRING",
        description: "You can find the ID on the embed footer",
        required: true
    },
],
  execute: async(client, interaction, args) => {
    
    const id = interaction.options.getString('id')
    
    const data = await confessSchema.findOne({ confessionID: id })
    if(!data) {
      return interaction.reply({ content: `:x: Could not find with id **${id}** or the user has updated their id`, ephemeral: true})
    }
      
      if(data.blacklist === "blacklist") {
        return interaction.reply({ content: ":x: This user has already blacklisted"})
    }
    
    await confessSchema.findOneAndUpdate({
      blacklist: 'blacklist'
    })
    await interaction.reply({ content: `✅ I have blacklisted user with id **${id}**`, ephemeral: true})
  }
}
  