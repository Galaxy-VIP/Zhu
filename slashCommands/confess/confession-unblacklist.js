const { MessageEmbed } = require('discord.js')
const confessSchema = require('../../models/confessionUser')
module.exports = {
    name: "confession-unblacklist",
    description: "Delete blacklist",
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
      return interaction.reply({ content: `:x: Could not find with id **${id}**`})
    }
      if(data.blacklist === "unblacklist") {
        return interaction.reply({ content: ":x: This user has already blacklisted"})
    }
    
    await confessSchema.findOneAndUpdate({
      blacklist: 'unblacklist'
    })
    await interaction.reply({ content: `✅ The blacklist has been removed from id **${id}**`, ephemeral: true})
  }
}