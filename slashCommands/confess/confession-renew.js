const { MessageEmbed } = require('discord.js')
const confessSchema = require('../../models/confessionUser')
const confessGuild = require('../../models/confession')
const humanizeDuration = require('humanize-duration')
const dataCooldown = 28800 * 1000
const cd = Date.now() + dataCooldown
const cooldown = new Set()
module.exports = {
  name: "confession-renew",
  description: "To update your id",
  execute: async(client, interaction, args) => {
    const confessData = await confessGuild.findOne({ guild: interaction.guild.id })
    if(!confessData) return interaction.reply({ content: ':x: Could find confession data in this server', ephemeral: true})
    
    
    if (cooldown.has(interaction.user.id)) {
    return interaction.reply({ content: `:x: Please try again in  **${humanizeDuration(cd - Date.now())}** to update your id again`, ephemeral: true })
    } else {
    const data = await confessSchema.findOne({ id: interaction.user.id })
    if(!data) {
      return interaction.reply({ content: `:x: Could not find your data`, ephemeral: true})
    }
      if(data.blacklist === "blacklist") {
        return interaction.reply({ content: ":x: You can't update your id, because you have been blocked from using confession", ephemeral: true})
    }
    
    await confessSchema.findOneAndUpdate({
      confessionID: randomName(6)
    })
    await interaction.reply({ content: `✅ Your id has been updated with id **${randomName(6)}**`, ephemeral: true})
    cooldown.add(interaction.user.id)
    setTimeout(() => {
      cooldown.delete(interaction.user.id)
    }, dataCooldown)
    }
  }
}


function randomName(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return "SK" + result;
}
  