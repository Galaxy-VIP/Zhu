const { MessageEmbed } = require('discord.js')
const confessSchema = require('../../models/confession')
const humanize = require('humanize-duration')
module.exports = {
    name: "confession-setup",
    description: "Confess setup",
    permission: "ADMINISTRATOR",
    options: [ 
        {
        name: 'channel',
        type: "CHANNEL",
        description: "Mention any text channel",
        required: true
        }, 
      {
        name: 'status',
        description: "To set confession is enable or disable",
        type: "STRING",
        required: true,
        choices: [
          {
            name: 'set',
            value: 'set-confess'
          },
          {
            name: 'remove',
            value: 'remove-confess'
          }
        ]
      }, 
      {
        name: 'cooldown',
        description: "Set confession cooldown ( 5 minutes is the default )",
        type: "NUMBER",
        required: false,
        min_value: 10,
        max_value: 600
      }
    ],
  execute: async(client, interaction, args) => {
    const cooldown = interaction.options.getNumber("cooldown")
    const cooldownTime = cooldown * 1000
    const channel = interaction.options.getChannel('channel')
    
    const value = interaction.options.get('status').value
    if(channel.type === "GUILD_VOICE") return interaction.reply({ content:"Please provide a valid text channel", ephemeral: true });
    if(channel.type === "GUILD_CATEGORY") return interaction.reply({ content:"Please provide a valid text channel", epehmeral: true });
    
    
    if(value == "set-confess") {
      const data = await confessSchema.findOne({ guild: interaction.guild.id })
      if(data) {
        return interaction.reply({ content: ":x: Confession already setup in this server", ephemeral: true})
      }
    
      await confessSchema.create({
        guild: interaction.guild.id,
        channel: channel.id,
        confession: 0,
        confessionCooldown: cooldownTime || 300 * 1000
    })
      const embed = new MessageEmbed()
      .setColor("GREEN")
      .setDescription("✅ I have setup the confession system in this server")
      .addField("Channel", channel.name)
      .addField("Cooldown", humanize(cooldownTime || 300 * 1000))
      .setTimestamp()
      .setAuthor("Confession", interaction.guild.iconURL({ dynamic: true }))
      await interaction.reply({ embeds: [embed], ephemeral: true})
      
    }
    else if(value == "remove-confess") {
      const data = await confessSchema.findOne({ guild: interaction.guild.id })
      if(!data) {
      return interaction.reply({ content: ":x: Could not find confession data in this server", ephemeral: true})
    }
    
      await confessSchema.deleteMany({
      guild: interaction.guild.id
    })
      await interaction.reply({ content: "✅ Confession has been removed", ephemeral: true})
    }
  }
}