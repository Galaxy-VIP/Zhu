const { MessageEmbed } = require("discord.js")
const confessUser = require("../../models/confessionUser")
const confess = require("../../models/confession")

module.exports = {
    name: "confession-delete",
    description: "Delete the confession message",
    permission: "MANAGE_SERVERS",
    options: [
        {
            name: "id",
            description: "ID Example 'Anonymous Confession #2'",
            required: true,
            type: "STRING"
        }
    ],
    execute: async(client, interaction, guild) => {
        const { options } = interaction
        const id = options.getString("id")
        const data = await confess.findOne({ guild: interaction.guild.id })
        if(!data) return interaction.reply({ content: ":x: Could not find confession data in this server", ephemeral: true})
        
        const channel = await client.channels.cache.get(data.channel)
        const messages = await channel.messages.fetch()
    const sentMessage = messages.find(msg => msg.embeds.length === 1 ? (msg.embeds[0].author && msg.embeds[0].author.name.endsWith(`#${id}`) ? true : false) : false)
        
    
    if(sentMessage) {
        const messageEdit = await channel.messages.fetch(sentMessage.id)
        
        const embed = new MessageEmbed()
        .setColor("PURPLE")
        .setDescription("-# This confession was removed by admin.")
        
        await messageEdit.edit({ embeds: [embed]})
        await interaction.reply({ content: "✅ Deleted successfully", ephemeral: true})
    }
        
        if(!sentMessage) {
            return interaction.reply({ content: ":x: Could not find the message id", ephemeral: true})
        }


 }
}