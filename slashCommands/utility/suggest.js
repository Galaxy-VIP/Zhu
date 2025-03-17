const { MessageEmbed, Modal, TextInputComponent, MessageActionRow } = require("discord.js")
module.exports = {
  name: "suggest",
  description: "Create a suggestion",
  execute: async(client, interaction, args) => {
    
    
    const modal = new Modal()
    .setCustomId("suggest")
    .setTitle("Suggestions")
    
    
    
    const cmd = new TextInputComponent()
    .setCustomId("suggestType")
    .setPlaceholder("Only for suggestions")
    .setLabel("To tell our developers")
    .setStyle("SHORT")
    .setRequired(true)
    
    
    
    const description = new TextInputComponent()
    .setCustomId("descriptionSuggest")
    .setPlaceholder("Be sure to be as detailed as possible")
    .setLabel("Describe your suggestions")
    .setStyle("PARAGRAPH")
    
    
    const compo = new MessageActionRow().addComponents(cmd)
    const compo2 = new MessageActionRow().addComponents(description)
    
    modal.addComponents(compo, compo2)
    await interaction.showModal(modal)
  }
}