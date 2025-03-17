const { MessageEmbed, Modal, TextInputComponent, MessageActionRow } = require("discord.js")

const reportChannel = "1268579740877455360"
module.exports = {
  name: "report",
  description: "Report if the bot got a bug or error",
  execute: async(client, interaction, args) => {
    
    
    const modal = new Modal()
    .setCustomId("report")
    .setTitle("Bug & Command Reporting")
    
    
    
    const cmd = new TextInputComponent()
    .setCustomId("type")
    .setPlaceholder("Only state the problematic command")
    .setLabel("What commands has a bug or is being error?")
    .setStyle("SHORT")
    .setRequired(true)
    
    
    
    const description = new TextInputComponent()
    .setCustomId("description")
    .setPlaceholder("Be sure to be as detailed as possible")
    .setLabel("Describe the error or bug")
    .setStyle("PARAGRAPH")
    .setRequired(true)
    
    
    const compo = new MessageActionRow().addComponents(cmd)
    const compo2 = new MessageActionRow().addComponents(description)
    
    modal.addComponents(compo, compo2)
    await interaction.showModal(modal)
  }
}