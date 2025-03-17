const lang = require('../../language')
const { MessageEmbed } = require("discord.js")
module.exports = {
  name: 'ban',
  description: "Bans member",
  permission: "BAN_MEMBERS",
  options: [
    {
      name: 'member',
      description: "Users who will be banned",
      type: "USER",
      required: true
    },
    {
      name: "reason",
      description: "Reason for being banned",
      type: "STRING",
      required: false
    }
  ],
  execute: async(client, interaction, args) => {
    const members = interaction.options.getMember("member")
    let reasons = interaction.options.getString('reason') || "-"
    const userCannotBan = new MessageEmbed()
    .setColor("RED")
    .setDescription(lang(interaction.guild, "CANT_BAN"))
    const userBan = new MessageEmbed()
    .setColor("RANDOM")
    .setDescription(`_${lang(interaction.guild, "BANNED")}_ **${members.user.tag}**\n\n__${lang(interaction.guild, "REASON")}__ **${reasons}**`)
    interaction.guild.members.cache.get(members.user.id).ban().then(async () => {
      interaction.reply({ embeds: [userBan]})
    }).catch(e => {
      return interaction.reply({ embeds: [userCannotBan], ephemeral: true})
    })
  }
}