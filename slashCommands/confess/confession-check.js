const { MessageEmbed, MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js')
const confessSchema = require('../../models/confession')
const confessUser = require('../../models/confessionUser')
const humanize = require('humanize-duration')
const wait = require('node:timers/promises').setTimeout;
module.exports = {
  name: "confession-check",
  description: "Confess check",
  execute: async (client, interaction, args) => {
    
    const data = await confessSchema.findOne({ guild: interaction.guild.id })
    let cdData;
    //if(data.confessionCooldown == 0) cdData = "No cooldown"
    if(data) {
      const removeButton = new MessageButton()
      .setCustomId('remove-btn')
      .setEmoji("1274675154517098539")
      .setLabel("Remove")
      .setStyle("DANGER")
      const deleteButton = new MessageButton()
      .setCustomId('delete-btn')
      .setEmoji("1274669483960569909")
      .setLabel("Delete this reply")
      .setStyle("DANGER")
      const setButton = new MessageButton()
      .setCustomId("set-btn")
      .setEmoji("1274670865203859548")
      .setLabel("Setup")
      .setStyle("SUCCESS")
      const cdButton = new MessageButton()
      .setLabel("Setup Cooldown")
      .setEmoji("1274670649679544361")
      .setCustomId("cd-btn")
      .setStyle("PRIMARY")
      const row = new MessageActionRow().addComponents(setButton, removeButton, cdButton, deleteButton)
      const embed = new MessageEmbed()
      .setColor('GREEN')
      .setAuthor(interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true }))
      .setTitle("Confession System")
      .addField("Confession Guild", interaction.guild.name)
      .addField("Confession Status", "<:topgg_opt_yes:1274670865203859548> Setup")
      .addField("Confession Channel", `<#${data.channel}>`)
      .addField("Confession Cooldown", humanize(data.confessionCooldown))
      .setDescription("\`\`\`Confession system currently set up on this server, if you want to remove the confession system, just click the 'Remove' button it will be erase all data confession on this server\`\`\`")
      .setTimestamp()
      await interaction.deferReply()
      await wait(1000)
      
      const m = await interaction.editReply({ embeds: [embed], components: [row]})
      
      const filter = i => i.user.id === interaction.user.id
      const collector = m.createMessageComponentCollector({ componentType: "BUTTON", filter, time: 120 * 1000 })
      
      collector.on("collect", async i => {
        
        if(i.customId === "remove-btn") {
          
          if(!i.member.permissions.has("ADMINISTRATOR")){
            await i.reply({ content: "You do not have **ADMIN** permission", ephemeral: true}).catch(e => {})
          }
          const removeData = await confessSchema.findOne({ guild: interaction.guild.id })
          if(!removeData) {
            await i.reply({ content: ":x: Data already deleted"}).catch(e => {})
          }
          if(removeData) {
          
            await confessSchema.deleteMany({ guild: interaction.guild.id })
            await confessUser.deleteMany({ guildId: interaction.guild.id })
            const embed = new MessageEmbed()
            .setColor('RED')
            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true }))
            .setTitle("Confession System")
            .addField("Confession Guild", interaction.guild.name)
            .addField("Confession Status", "<:topgg_opt_no:1274675154517098539> Not set")
            .addField("Confession Channel", `<:topgg_opt_no:1274675154517098539> Not set`)
            .addField("Confession Cooldown", "<:topgg_opt_no:1274675154517098539> Not set")
            .setDescription("\`\`\`The confession system is currently not set up, click the 'Delete this reply' button to delete the reply\`\`\`")
            .setTimestamp()
            removeButton.setDisabled(true)
            setButton.setDisabled(true)
            cdButton.setDisabled(true)
            await i.update({ embeds: [embed], components: [row]})
            await i.reply({ content: "I have deleted the confession system on this server", ephemeral: true}).catch(e => {})
          }
          
        }
        if(i.customId === "delete-btn") {
          await interaction.deleteReply()
          collector.stop()
        }
        
        if(i.customId === 'set-btn') {
          if(!i.member.permissions.has("ADMINISTRATOR")){
            await i.reply({ content: "You do not have **ADMIN** permission", ephemeral: true}).catch(e => {})
          }
          
          const dataConfess = await confessSchema.findOne({ guild: interaction.guild.id })
          if(dataConfess) {
            await i.reply({ content: ":x: Currently confession has already set up", ephemeral: true}).catch(e => {})
          }
          
          if(!dataConfess) {
            let selectChannel = new MessageActionRow().addComponents(
              new MessageSelectMenu()
              .setCustomId('channel-set')
              .setPlaceholder('Nothing selected')
              .addOptions([
                {
                  label: `Cancel`,
                  description: 'Cancel the channel selection',
                  value: 'cancel',
                },
              ]),
            )
            interaction.guild.channels.cache.first(24).forEach(async (channel) => {
              selectChannel.components[0].addOptions([
                {
                  label: `${channel.name}`,
                  description: `${channel.type}`,
                  value: `${channel.id}`,
                },
              ])
            })
            
            const selectMenu = new MessageActionRow().addComponents(selectChannel)
            const embed = new MessageEmbed()
            .setColor("BLUE")
            .setDescription("The channel must be **'TEXT CHANNEL'**")
            .setFooter("Recommended to using /confess-setup")
             await i.update({ embeds: [embed], components: [selectChannel]})
            
            const filterUser = i => i.user.id === interaction.user.id
            const collector = interaction.channel.createMessageComponentCollector({ componentType: "SELECT_MENU", filterUser, time: 4800 * 1000 })
          
            collector.on("collect", async i => {
              
               if(i.customId === "channel-set") {
                 if(!i.member.permissions.has("ADMINISTRATOR")){
                   await i.reply({ content: "You do not have **ADMIN** permission", ephemeral: true}).catch(e => {})
                 }
                if(i.values[0] === "cancel") {
                  embed.setDescription("The action has been cancelled")
                  await interaction.editReply({ embeds: [embed], components: []})
                  collector.stop()
                }
                const channelId = i.values[0]
                const channelText = client.channels.cache.get(channelId)
                if(channelText.type === "GUILD_VOICE") return i.reply({ content: "The channel must be **'Text Channel'**", ephemeral: true}).catch(e => {})
                if(channelText.type === "GUILD_CATEGORY") return i.reply({ content: "The channel must be **'Text Channel'**", ephemeral: true}).catch(e => {})
                
                await confessSchema.create({
                  guild: interaction.guild.id,
                  channel: i.values[0],
                  confession: 0,
                  confessionCooldown: 300 * 1000
                })

                const embedSet = new MessageEmbed()
                .setColor("GREEN")
                .setDescription("\`\`\`Confession system successfully set!\`\`\`")
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true }))
                .addField("Confession Guild", interaction.guild.name)
                .addField("Confession Status", "<:topgg_opt_yes:1274670865203859548> Setup")
                .addField("Confession Channel", `<#${i.values[0]}>`)
                .addField("Confession Cooldown", humanize(300*1000))
                .setTimestamp()
                //setButton.setDisabled(true)
                //removeButton.setDisabled(true)
                await i.update({ embeds: [embedSet], components: [row]})
                await collector.stop()
                //console.log(i.values)
              }
            })
                                                            
          
            }
        
          }
        if(i.customId === "cd-btn") {
          if(!i.member.permissions.has("ADMINISTRATOR")){
            await i.reply({ content: "You do not have **ADMIN** permission", ephemeral: true}).catch(e => {})
          }
           const cdData = await confessSchema.findOne({ guild: interaction.guild.id })
            if(!cdData) {
              return i.reply({ content: ":x: Could not find confession data", ephemeral: true }).catch(e => {})
            }
           const cdSet = new MessageSelectMenu()
           .setCustomId("cd-set")
           .setPlaceholder("Cooldown Time")
           .addOptions([
             {
               label: "Back",
               description: "Back to the menu",
               value: "back-menu",
               emoji: "⏪"
            },
             {
               label: "No cooldown",
               value: "no-cd",
               description: "Turn off the cooldown",
               emoji: "🈵"
             },
             {
            
               label: "10m",
               description: "Set the cooldown to 10 minutes",
               value: "10m",
               emoji: "<a:animated_clock:1275548604232237138>"
            },
             {
              
               label: "15m",
               description: "Set the cooldown to 15 minutes",
               value: "15m",
               emoji: "<a:animated_clock:1275548604232237138>"
            },
             {
               label: "30m",
               description: "Set the cooldown to 30 minutes",
               value: "30m",
               emoji: "<a:animated_clock:1275548604232237138>"
             },
             {
               label: "1h",
               description: "Set the cooldown to 1 hour",
               value: "1h",
               emoji: "<a:animated_clock:1275548604232237138>"
             }
           ])
           const selectCooldown = new MessageActionRow().addComponents(cdSet)
           await i.update({ components: [selectCooldown]})
          const filter = i => interaction.user.id
          const collector = interaction.channel.createMessageComponentCollector({ componentType: "SELECT_MENU", filter, time: 4800 * 1000})
          
          collector.on("collect", async i => {
            if(i.values[0] === "back-menu") {
                 await i.update({components: [row]})

             }
             if(i.values[0] === "10m") {
               await confessSchema.findOneAndUpdate({ confessionCooldown: 600 * 1000 })
               //cdButton.setDisabled(true)
               //setButton.setDisabled(true)
               const embedSet = new MessageEmbed()
                .setColor("GREEN")
                .setDescription("\`\`\`Cooldown has been set successfully!\`\`\`")
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true }))
                .addField("Confession Guild", interaction.guild.name)
                .addField("Confession Status", "<:topgg_opt_yes:1274670865203859548> Setup")
                .addField("Confession Channel", `<#${cdData.channel}>`)
                .addField("Confession Cooldown", humanize(600*1000))
                .setTimestamp()
               //embed.fields[3] = { name: "Confession Cooldown", value: "10 Minutes"}
               await i.update({ embeds: [embedSet], components: [row]})
               collector.stop()
             }
            if(i.values[0] === "15m") {
               await confessSchema.findOneAndUpdate({ confessionCooldown: 900 * 1000 })
               //cdButton.setDisabled(true)
               //setButton.setDisabled(true)
               //embed.fields[3] = { name: "Confession Cooldown", value: "15 Minutes"}
              const embedSet = new MessageEmbed()
                .setColor("GREEN")
                .setDescription("\`\`\`Cooldown has been set successfully!\`\`\`")
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true }))
                .addField("Confession Guild", interaction.guild.name)
                .addField("Confession Status", "<:topgg_opt_yes:1274670865203859548> Setup")
                .addField("Confession Channel", `<#${cdData.channel}>`)
                .addField("Confession Cooldown", humanize(900*1000))
                .setTimestamp()
               await i.update({ embeds: [embedSet], components: [row]})
               collector.stop()
             }
            if(i.values[0] === "30m") {
               await confessSchema.findOneAndUpdate({ confessionCooldown: 1800 * 1000 })
               //cdButton.setDisabled(true)
               //setButton.setDisabled(true)
              const embedSet = new MessageEmbed()
                .setColor("GREEN")
                .setDescription("\`\`\`Cooldown has been set successfully!\`\`\`")
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true }))
                .addField("Confession Guild", interaction.guild.name)
                .addField("Confession Status", "<:topgg_opt_yes:1274670865203859548> Setup")
                .addField("Confession Channel", `<#${cdData.channel}>`)
                .addField("Confession Cooldown", humanize(1800*1000))
                .setTimestamp()
               //embed.fields[3] = { name: "Confession Cooldown", value: "30 Minutes"}
               await i.update({ embeds: [embedSet], components: [row]})
               collector.stop()
             }
            if(i.values[0] === "1h") {
               await confessSchema.findOneAndUpdate({ confessionCooldown: 3600 * 1000 })
               //cdButton.setDisabled(true)
               //setButton.setDisabled(true)
              const embedSet = new MessageEmbed()
                .setColor("GREEN")
                .setDescription("\`\`\`Cooldown has been set successfullyt!\`\`\`")
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true }))
                .addField("Confession Guild", interaction.guild.name)
                .addField("Confession Status", "<:topgg_opt_yes:1274670865203859548> Setup")
                .addField("Confession Channel", `<#${cdData.channel}>`)
                .addField("Confession Cooldown", humanize(3600*1000))
                .setTimestamp()
               //embed.fields[3] = { name: "Confession Cooldown", value: "1 Hour"}
               await i.update({ embeds: [embedSet], components: [row]})
               collector.stop()
             }
         })

        }
      })
      collector.on('end', async i => {
        removeButton.setDisabled(true)
        deleteButton.setDisabled(true)
        setButton.setDisabled(true)
        cdButton.setDisabled(true)
        
        await interaction.editReply({ components: [row]}).catch(e => {})
      })
    }
    
    
    
    //
    //
    //
    //
    if(!data) {
      const removeButton = new MessageButton()
      .setCustomId('remove-btn')
      .setEmoji("1274675154517098539")
      .setLabel("Remove")
      .setStyle("DANGER")
      const deleteButton = new MessageButton()
      .setCustomId('delete-btn')
      .setEmoji("1274669483960569909")
      .setLabel("Delete this reply")
      .setStyle("DANGER")
      const setButton = new MessageButton()
      .setCustomId("set-btn")
      .setEmoji("1274670865203859548")
      .setLabel("Setup")
      .setStyle("SUCCESS")
      const cdButton = new MessageButton()
      .setLabel("Setup Cooldown")
      .setEmoji("1274670649679544361")
      .setCustomId("cd-btn")
      .setStyle("PRIMARY")
      const row = new MessageActionRow().addComponents(setButton, removeButton, cdButton, deleteButton)
      const embed = new MessageEmbed()
      .setColor('RED')
      .setAuthor(interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true }))
      .setTitle("Confession System")
      .addField("Confession Guild", interaction.guild.name)
      .addField("Confession Status", "<:topgg_opt_no:1274675154517098539> Not set")
      .addField("Confession Channel", `<:topgg_opt_no:1274675154517098539> Not set`)
      .addField("Confession Cooldown", "<:topgg_opt_no:1274675154517098539> Not set")
      .setDescription("\`\`\`The confession system is currently not set up, if you want to set the confession system just click the set button\`\`\`")
      .setTimestamp()
      await interaction.reply({ embeds: [embed], components: [row]})
      const filter = i => i.user.id === interaction.user.id
      const collector = interaction.channel.createMessageComponentCollector({ componentType: "BUTTON", filter, time: 120 * 1000 })
      
      collector.on("collect", async i => {
        
        if(i.customId === "remove-btn") {
          
          if(!i.member.permissions.has("ADMINISTRATOR")){
            await i.reply({ content: "You do not have **ADMIN** permission", ephemeral: true}).catch(e => {})
          }
          const removeData = await confessSchema.findOne({ guild: interaction.guild.id })
          if(!removeData) {
            await i.reply({ content: ":x: Data already deleted"}).catch(e => {})
          }
          if(removeData) {
          
            await confessSchema.deleteMany({ guild: interaction.guild.id })
            await confessUser.deleteMany({ guildId: interaction.guild.id })
            const embed = new MessageEmbed()
            .setColor('RED')
            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true }))
            .setTitle("Confession System")
            .addField("Confession Guild", interaction.guild.name)
            .addField("Confession Status", "<:topgg_opt_no:1274675154517098539> Not set")
            .addField("Confession Channel", `<:topgg_opt_no:1274675154517098539> Not set`)
            .addField("Confession Cooldown", "<:topgg_opt_no:1274675154517098539> Not set")
            .setDescription("\`\`\`The confession system is currently not set up, click the 'Delete this reply' button to delete the reply\`\`\`")
            .setTimestamp()
            //removeButton.setDisabled(true)
            //setButton.setDisabled(true)
            //cdButton.setDisabled(true)
            await interaction.editReply({ embeds: [embed], components: [row]})
            await i.reply({ content: "I have deleted the confession system on this server", ephemeral: true})
          }
          
        }
        if(i.customId === "delete-btn") {
          await interaction.deleteReply()
        }
        
        if(i.customId === 'set-btn') {
          if(!i.member.permissions.has("ADMINISTRATOR")){
            await i.reply({ content: "You do not have **ADMIN** permission", ephemeral: true}).catch(e => {})
          }
          
          const dataConfess = await confessSchema.findOne({ guild: interaction.guild.id })
          if(dataConfess) {
            await i.reply({ content: ":x: Currently confession has already set up", ephemeral: true}).catch(e => {})
          }
          
          if(!dataConfess) {
            let selectChannel = new MessageActionRow().addComponents(
              new MessageSelectMenu()
              .setCustomId('channel-set')
              .setPlaceholder('Nothing selected')
              .addOptions([
                {
                  label: `Cancel`,
                  description: 'Cancel the channel selection',
                  value: 'cancel',
                },
              ]),
            )
            interaction.guild.channels.cache.filter((channel) => channel.type === "GUILD_TEXT").forEach(async (channel) => {
              let channelType = channel.type
              const channelName = channel.type.replace("GUILD_TEXT", "Text Channel")
              selectChannel.components[0].addOptions([
                {
                  label: `${channel.name}`,
                  description: `${channelName}`,
                  value: `${channel.id}`,
                },
              ])
            })
            
            const selectMenu = new MessageActionRow().addComponents(selectChannel)
            const embed = new MessageEmbed()
            .setColor("BLUE")
            .setDescription("The channel must be **'TEXT CHANNEL'**")
            .setFooter("Recommended to using /confess-setup")
             await i.update({ embeds: [embed], components: [selectChannel]})
            
            const filterUser = i => i.user.id === interaction.user.id
            const collector = interaction.channel.createMessageComponentCollector({ componentType: "SELECT_MENU", filterUser, time: 120 * 1000 })
          
            collector.on("collect", async i => {
               if(i.customId === "channel-set") {
                if(i.values[0] === "cancel") {
                  embed.setDescription("The action has been cancelled")
                  await interaction.editReply({ embeds: [embed], components: []})
                  collector.stop()
                }
                const channelId = i.values[0]
                const channelText = client.channels.cache.get(channelId)
                if(channelText.type === "GUILD_VOICE") return i.reply({ content: "The channel must be **'Text Channel'**", ephemeral: true}).catch(e => {})
                if(channelText.type === "GUILD_CATEGORY") return i.reply({ content: "The channel must be **'Text Channel'**", ephemeral: true}).catch(e => {})
                
                await confessSchema.create({
                  guild: interaction.guild.id,
                  channel: i.values[0],
                  confession: 0,
                  confessionCooldown: 300 * 1000
                })

                const embedSet = new MessageEmbed()
                .setColor("GREEN")
                .setDescription("\`\`\`Confession system successfully set!\`\`\`")
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true }))
                .addField("Confession Guild", interaction.guild.name)
                .addField("Confession Status", "<:topgg_opt_yes:1274670865203859548> Setup")
                .addField("Confession Channel", `<#${i.values[0]}>`)
                .addField("Confession Cooldown", humanize(300*1000))
                .setTimestamp()
                //setButton.setDisabled(true)
                //removeButton.setDisabled(true)
                await i.update({ embeds: [embedSet], components: [row]})
                await collector.stop()
                //console.log(i.values)
              }
            })
            collector.on('end', async i => {
              await i.update({ components: []})
            })
                                                            
          
            }
        
          } 
         if(i.customId === "cd-btn") {
           if(!i.member.permissions.has("ADMINISTRATOR")){
             await i.reply({ content: "You do not have **ADMIN** permission", ephemeral: true}).catch(e => {})
           }
           const cdData = await confessSchema.findOne({ guild: interaction.guild.id })
            if(!cdData) {
              return i.reply({ content: ":x: Could not find confession data", ephemeral: true }).catch(e => {})
            }
           const cdSet = new MessageSelectMenu()
           .setCustomId("cd-set")
           .setPlaceholder("Cooldown Time")
           .addOptions([
             {
               label: "Back",
               description: "Back to the menu",
               value: "back-menu",
               emoji: "⏪"
            },
             {
               label: "No cooldown",
               description: "Turn off the cooldown",
               value: "no-cd",
               emoji: "🈵"
            },
             {
            
               label: "10m",
               description: "Set the cooldown to 10 minutes",
               value: "10m",
               emoji: "<a:animated_clock:1275548604232237138>"
            },
             {
              
               label: "15m",
               description: "Set the cooldown to 15 minutes",
               value: "15m",
               emoji: "<a:animated_clock:1275548604232237138>"
            },
             {
               label: "30m",
               description: "Set the cooldown to 30 minutes",
               value: "30m",
               emoji: "<a:animated_clock:1275548604232237138>"
             },
             {
               label: "1h",
               description: "Set the cooldown to 1 hour",
               value: "1h",
               emoji: "<a:animated_clock:1275548604232237138>"
             }
           ])
           const selectCooldown = new MessageActionRow().addComponents(cdSet)
           await i.update({ components: [selectCooldown]})
          const filter = i => interaction.user.id
          const collector = interaction.channel.createMessageComponentCollector({ componentType: "SELECT_MENU", filter, time: 120 * 1000})
          
          collector.on("collect", async i => {
            if(i.values[0] === "back-menu") {
                 await i.update({components: [row]})

             }
             if(i.values[0] === "10m") {
               await confessSchema.findOneAndUpdate({ confessionCooldown: 600 * 1000 })
               //cdButton.setDisabled(true)
               //setButton.setDisabled(true)
               const embedSet = new MessageEmbed()
                .setColor("GREEN")
                .setDescription("\`\`\`Cooldown has been set successfully!\`\`\`")
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true }))
                .addField("Confession Guild", interaction.guild.name)
                .addField("Confession Status", "<:topgg_opt_yes:1274670865203859548> Setup")
                .addField("Confession Channel", `<#${cdData.channel}>`)
                .addField("Confession Cooldown", humanize(600*1000))
                .setTimestamp()
               //embed.fields[3] = { name: "Confession Cooldown", value: "10 Minutes"}
               await i.update({ embeds: [embedSet], components: [row]})
               collector.stop()
             }
            if(i.values[0] === "15m") {
               await confessSchema.findOneAndUpdate({ confessionCooldown: 900 * 1000 })
               //cdButton.setDisabled(true)
               //setButton.setDisabled(true)
               //embed.fields[3] = { name: "Confession Cooldown", value: "15 Minutes"}
              const embedSet = new MessageEmbed()
                .setColor("GREEN")
                .setDescription("\`\`\`Cooldown has been set successfully!\`\`\`")
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true }))
                .addField("Confession Guild", interaction.guild.name)
                .addField("Confession Status", "<:topgg_opt_yes:1274670865203859548> Setup")
                .addField("Confession Channel", `<#${cdData.channel}>`)
                .addField("Confession Cooldown", humanize(900*1000))
                .setTimestamp()
               await i.update({ embeds: [embedSet], components: [row]})
               collector.stop()
             }
            if(i.values[0] === "30m") {
               await confessSchema.findOneAndUpdate({ confessionCooldown: 1800 * 1000 })
               //cdButton.setDisabled(true)
               //setButton.setDisabled(true)
              const embedSet = new MessageEmbed()
                .setColor("GREEN")
                .setDescription("\`\`\`Cooldown has been set successfully!\`\`\`")
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true }))
                .addField("Confession Guild", interaction.guild.name)
                .addField("Confession Status", "<:topgg_opt_yes:1274670865203859548> Setup")
                .addField("Confession Channel", `<#${cdData.channel}>`)
                .addField("Confession Cooldown", humanize(1800*1000))
                .setTimestamp()
               //embed.fields[3] = { name: "Confession Cooldown", value: "30 Minutes"}
               await i.update({ embeds: [embedSet], components: [row]})
               collector.stop()
             }
            if(i.values[0] === "1h") {
               await confessSchema.findOneAndUpdate({ confessionCooldown: 3600 * 1000 })
               //cdButton.setDisabled(true)
               //setButton.setDisabled(true)
              const embedSet = new MessageEmbed()
                .setColor("GREEN")
                .setDescription("\`\`\`Cooldown has been set successfully!\`\`\`")
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true }))
                .addField("Confession Guild", interaction.guild.name)
                .addField("Confession Status", "<:topgg_opt_yes:1274670865203859548> Setup")
                .addField("Confession Channel", `<#${cdData.channel}>`)
                .addField("Confession Cooldown", humanize(3600*1000))
                .setTimestamp()
               //embed.fields[3] = { name: "Confession Cooldown", value: "1 Hour"}
               await i.update({ embeds: [embedSet], components: [row]})
               collector.stop()
             }
         })
           collector.on('end', async i => {
             await i.update({ components: []})
           })

        }
      })
      collector.on('end', async i => {
        removeButton.setDisabled(true)
        deleteButton.setDisabled(true)
        setButton.setDisabled(true)
        cdButton.setDisabled(true)
        
        await interaction.editReply({ components: [row]}).catch(e => {})
      })
    }
  }
}