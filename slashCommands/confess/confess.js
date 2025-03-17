const { MessageEmbed } = require('discord.js')
const confessSchema = require('../../models/confession')
const confessUser = require('../../models/confessionUser')
const humanizeDuration = require("humanize-duration")
const cooldown = new Set()
const confessID = randomName(6)
module.exports = {
    name: "confess",
    description: "Confess",
    options: [ 
        {
        name: 'confession',
        type: "STRING",
        description: "The confession text",
        required: true
    },
    {
        name: "attachment",
        type: "ATTACHMENT",
        description: "Image or GIF to send an attach",
        required: false
    }
],
  execute: async(client, interaction, args) => {
    const data = await confessSchema.findOne({ guild: interaction.guild.id })
    if(!data) return interaction.reply({ content: ":x: This server hasn't setup confession system", ephemeral: true})
    const dataCooldown = data.confessionCooldown
    const cd = Date.now() + data.confessionCooldown
    if (cooldown.has(interaction.user.id)) {
    return interaction.reply({ content: `:x: Please try again in  **${humanizeDuration(cd - Date.now())}** to send a confession again`, ephemeral: true });
    
  } else {
    const confess = await interaction.options.getString('confession')
    const attachment = await interaction.options.getAttachment('attachment')
    const userData = await confessUser.findOne({ guildId: interaction.guild.id })
    if(!userData) {
        await confessUser.create({
            id: interaction.member.id,
            guildId: interaction.guild.id,
            confessionID: confessID,
            blacklist: "unblacklist"
        })
       return interaction.reply({ content: `✅ Your account has been registered with id **${confessID}**, please type /confess again to send a confession`, ephemeral: true})
    } 
    if(userData.blacklist === "blacklist") {
        return interaction.reply({ content: ":x: You have been blocked from submitting confessions", ephemeral: true})
    }


    data.confession += 1
    await data.save()
    const embed = new MessageEmbed()
    .setColor("BLUE")
    .setAuthor("Anonymous Confession #"+ data.confession, interaction.guild.iconURL({ dynamic: true }))
    .setDescription(confess)
    .setTimestamp()
    .setFooter(`${userData.confessionID} | type /confess to send a confession`)
    if(attachment) {
        if(attachment.contentType === "video/quicktime") {
          data.confession -= 1
          await data.save()
          return interaction.reply({ content: ":x: Your attachment is not valid. The file must end in  \`\`\`jpg, jpeg, png, gif\`\`\`", ephemeral: true})
          
        } else if(attachment.contentType === 'application/zip') {
          
          data.confession -= 1
          await data.save()
          return interaction.reply({ content: ":x: Your attachment is not valid. The file must end in  \`\`\`jpg, jpeg, png, gif\`\`\`", ephemeral: true})
        }  else if(attachment.contentType === "video/mp4") {
          
          data.confession -= 1
          await data.save()
          return interaction.reply({ content: ":x: Your attachment is not valid. The file must end in  \`\`\`jpg, jpeg, png, gif\`\`\`", ephemeral: true})
         } else if(attachment.contentType === null) {
          
          data.confession -= 1
          await data.save()
          return interaction.reply({ content: ":x: Your attachment is not valid. The file must end in  \`\`\`jpg, jpeg, png, gif\`\`\`", ephemeral: true})
            
          } else {
            embed.setImage(attachment.url ? attachment.proxyURL : null)
          }
    }
      client.channels.cache.get(data.channel).send({ embeds: [embed]})
      await interaction.reply({ content: "✅ Your confess has been sent", ephemeral: true})
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
  