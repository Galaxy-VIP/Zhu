const { MessageEmbed, MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js')
const {stripIndents} = require('common-tags')
const lang = require("../language")
module.exports = {
    name: 'help',
    aliases: ['h'],
    run: async (client, msg, args) => {
      const inviteButton = new MessageButton()
      .setURL("https://discord.com/oauth2/authorize?client_id=1325108975254900798&scope=bot&permissions=459293121662")
      .setLabel("Invite Me")
      .setStyle("LINK")
      const supportButton = new MessageButton()
      .setURL("https://discord.gg/FTNZcbnMya")
      .setLabel("Support Server")
      .setStyle("LINK")
      
      
      
      const row = new MessageActionRow()
      .addComponents(
        inviteButton
        )
        const embed = new MessageEmbed()
        .setColor("PURPLE")
        .setAuthor(`${lang(msg.guild, "COMMANDS_LIST")} - ${client.commands.size} ${lang(msg.guild, "COMMANDS")}`, msg.author.displayAvatarURL({dynamic: true}))
        .setDescription("\`\`\`For the slashCommands using /help\`\`\`")
        .setThumbnail(msg.guild.iconURL({dynamic: true}))
        .addFields(
            { name: "<:settings:885195095840804885> Utility "+ lang(msg.guild, "COMMANDS"), value: stripIndents`
> \`avatar\`, \`ping\`, \`youtubedownload\`, \`report\`, \`emojilist\`, \`playstore\`, \`movie\``},
            { name: "<:certifiedmod:885185036419219496> Moderation", value: stripIndents`
> \`setprefix\`, \`setlanguage\`, \`clear\`, \`addemoji\`` },
            { name: "<:store_tag:885191656159215626> Backup", value: stripIndents`
> \`backup\`` },
            { name: "<:iconsamp:1270379750807965840> Sa-mp "+ lang(msg.guild, "COMMANDS"), value: stripIndents`
> \`setip\`, \`serverstatus\`, \`removeserver\`, \`ip\`, \`players\`` },
            { name: "<:stats_2:885192830283313232> Information "+ lang(msg.guild, "COMMANDS"), value: stripIndents`
> \`steam\`, \`topgginfo\` , \`device\`, \`worldclock\`, \`npm\`, \`permissions\`, \`whois\`, \`stats\`, \`discrim\`` 
            },
        )
        .setFooter(lang(msg.guild, "COMMANDS_LIST"))
        msg.channel.send({ embeds: [embed], components: [row] })
    }
}