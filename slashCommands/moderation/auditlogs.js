const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js')
const logsSchema = require('../../models/logs')
const { stripIndents } = require('common-tags')
module.exports = {
  name: 'auditlogs',
  description: "Logs usage",
  permission: "ADMINISTRATOR",
  options: [
    {
      name: 'channel',
      type: "CHANNEL",
      description: "Channel to set the audit-logs",
      required: true
    }
  ],
  execute: async(client, interaction, args) => {
    const channel = interaction.options.getChannel("channel")
    const { guild, options } = interaction
    if(channel.type === "GUILD_VOICE") return interaction.reply({ content:"Please provide a valid text channel", ephemeral: true })
    if(channel.type === "GUILD_CATEGORY") return interaction.reply({ content:"Please provide a valid text channel", ephemeral: true })
    
    const data = await logsSchema.findOne({ 
      guild: interaction.guild.id
    
    })
    
    if(data) {
      return interaction.reply({ content: "You have already an audit-log system", ephemeral: true})
    }
    const button = new MessageButton()
    .setCustomId("list")
    .setLabel("List Enable")
    .setEmoji("📜")
    .setStyle("PRIMARY")
    
    const row = new MessageActionRow()
    .addComponents(button)
    await logsSchema.create({
      guild: guild.id,
      channel: channel.id
    })
    const embed = new MessageEmbed()
    .setColor("GREEN")
    .setDescription(`<:check:770913043974586400> Audit logs is set to <#${channel.id}>`)
    const embedMSG = await interaction.reply({ embeds: [embed], components: [row]})
    
    const collector = await interaction.channel.createMessageComponentCollector({ componentType: "BUTTON", time: 120 * 1000})
    
    collector.on("collect", async i =>{
      if(i.customId === "list") {
        let embed2 = new MessageEmbed()
        .setColor("BLUE")
        .setTitle("List logs are enabled")
        .setDescription(stripIndents`
        
        Invite Created: <:check:770913043974586400>
        Bulk Messages Delete: <:check:770913043974586400>
        Message Deleted: <:check:770913043974586400>
        Message Edited: <:check:770913043974586400>
        Role Created: <:check:770913043974586400>
        Role Deleted: <:check:770913043974586400>
        Role Updated: <:check:770913043974586400>
        Voice Disconnected: <:check:770913043974586400>
        Voice Channel Joined: <:check:770913043974586400>
        Voice Channel Left: <:check:770913043974586400>
        Voice Channel Changed: <:check:770913043974586400>
        Channel Created: <:check:770913043974586400>
        Channel Updated: <:check:770913043974586400>
        Channel Deleted: <:check:770913043974586400>
        `)
        .setTimestamp()
        await interaction.editReply({ embeds: [embed2],  components: []})
      }
    })
  }
}