const { MessageEmbed } = require('discord.js')
const logsSchema = require('../../models/logs')


module.exports = {
  name: "auditlogs-delete",
  description: "Delete the audit-logs",
  permission: "ADMINISTRATOR",
  execute: async(client, interaction, args) => {
    const data = await logsSchema.findOne({
      guild: interaction.guild.id
    })
    
    if(!data) return interaction.reply({ content: ":x: This server is not set any audit-logs", ephemeral: true})
    
    await logsSchema.deleteMany({ 
      guild: interaction.guild.id
    })
    await interaction.reply({ content: "<:check:770913043974586400> Deleted audit-logs in this server, thank you.", ephemeral: true})
  }
}