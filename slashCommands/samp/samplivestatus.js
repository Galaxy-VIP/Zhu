const modelsSamp = require('../../models/sampserver.js')
const { MessageEmbed, MessageSelectMenu, MessageActionRow } = require('discord.js')
const sampLive = require('../../models/samplive')
const samp = require("samp-query")
const { stripIndents } = require("common-tags");
module.exports = {
  name: 'samplivestatus',
  description: "Samp live stats",
  ownerOnly: true,
  permission: "ADMINISTRATOR",
  options: [
    {
      name: "channel",
      required: true,
      type: "CHANNEL",
      description: "Mention a text channel"
    }
  ],
  execute: async(client, interaction, args) => {
    const { options } = interaction
    const channel = options.getChannel("channel")
    if(channel.type === "GUILD_VOICE") return interaction.reply({ content:"Please provide a valid text channel", ephemeral: true})
    if(channel.type === "GUILD_CATEGORY") return interaction.reply({ content:"Please provide a valid text channel", ephemeral: true})
    const data = await modelsSamp.findOne({ guild: interaction.guild.id })
    if(!data) return interaction.reply({ content: `:x: This server isn't set the ip yet, please run the command /setip or .setip to set the ip`, ephemeral: true})
    
    const sampLiveData = await sampLive.findOne({ guild: interaction.guild.id })
    
    if(sampLiveData) {
      return interaction.reply({ content: ":x: Samp live already set up!", ephemeral: true})
    } else {
      await sampLive.create({
        guild: interaction.guild.id,
        channel: channel.id
      })
    }
      const sampLiveData2 = await sampLive.findOne({ guild: interaction.guild.id })
      let options2 = {
        host: data.ip,
        port: data.port
    };
      const embed = new MessageEmbed()
      .setColor("GREEN")
      .setAuthor(interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true }))
      .setDescription("Samp live status has been set up, it will be update every 10 minutes")
      .addField("Guild", interaction.guild.name + " " + "(" +interaction.guild.id + ")")
      .addField("Channel", "<#" +channel.id + "> " + "(" +channel.id + ")")
      .setTimestamp()
      await interaction.reply({ embeds: [embed], ephemeral: true})
      const select = new MessageSelectMenu()
      .setCustomId(`settings-${interaction.guild.id}`)
      .setPlaceholder("Settings")
      .addOptions([
        {
          label: "Delete",
          value: `delete-${sampLiveData2.guild}`,
          description: "Delete samp live status in this server"
        },
        {
          label: "Change Channel",
          value: `updatechannel-${sampLiveData2.guild}`,
          description: "To change the channel"
        },
        {
          label: "Update Ip and Port",
          value: `updateip-port-${sampLiveData2.guild}`,
          description: "Update the ip and port"
        },
         {
          label: "Information",
          value: `information-${sampLiveData2.guild}`,
          description: "Samp live status information"
        }
      ])
      const selectRow = new MessageActionRow().addComponents(select)
      const sentEmbed = new MessageEmbed()
      .setColor("BLUE")
      samp(options2, async function(err, state) {
        if (err) {
          sentEmbed.setDescription("Server is offline")
      } else if (state) {
        let playerslst = state.players.map(
          e => `\`${e.id} :   ${e.name.replace("_", " ")}  :   ${e.ping} ms\``
        );
        if (playerslst === false) playerslst = "** **"
        sentEmbed.setTitle(state.hostname)
        sentEmbed.setTimestamp()
        sentEmbed.setDescription(stripIndents`
      [ ${state.online} Players Online ]
      
      
      [  ID  : Players Name  : Players Ping  ]
        ${playerslst.join("\n")}`)
        sentEmbed.setFooter(`Samp Live Status | ${sampLiveData2.channel}`)
       }
        client.channels.cache.get(sampLiveData2.channel).send({ embeds: [sentEmbed], components: [selectRow]})
     })
    }
  }