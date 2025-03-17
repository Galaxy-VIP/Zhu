const { MessageEmbed } = require('discord.js')
module.exports = {
  name: 'snipe',
  description: 'Get message deleted',
  options: [ 
  {
    name: 'channel',
    type: "CHANNEL",
    description: "Mention text channel",
    required: false
  }
],
  execute: async (client, interaction, args) => {
    const channel = interaction.options.getChannel('channel') || interaction.channel
    if(channel.type === "GUILD_VOICE") return interaction.reply({ content:"Please provide a valid text channel", ephemeral: true });
    if(channel.type === "GUILD_CATEGORY") return interaction.reply({ content:"Please provide a valid text channel", ephemeral: true });
    const msg = client.snipes.get(channel.id);
    let embed = new MessageEmbed()
    .setDescription("There's no messages are deleted on " + channel.name)
    .setColor("BLUE")
    if(!msg) return interaction.reply({ embeds: [embed], ephemeral: true})
    let image = msg.attachments.first()
    let embedSend = new MessageEmbed()
    .setAuthor(msg.author.globalName, msg.author.displayAvatarURL())
    .addField("Author", msg.author.username, true)
    .addField("Message", msg.content || "Embed or Attachment", true)
    .setColor('BLUE')
    if(msg.attachments.size > 0) {
      embedSend.setImage(image.url ? image.proxyURL : null)
  }
    await interaction.reply({ embeds: [embedSend]})
  }
}