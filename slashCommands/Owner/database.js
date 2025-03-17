const { MessageEmbed } = require('discord.js')


module.exports = {
  name: "database",
  description: "If one day it is no longer operational, it will be easier for the developer than deleting the entire database from the server",
  ownerOnly: true,
  options: [
    {
      name: "Choose",
      description: "Zakandajdfrjgrngueu912139",
      required: true,
      type: "STRING",
      choices: [
        {
          name: "Samp DATABASE",
          value: 'samp-dt'
        },
        {
          name: "Confession DATABASE",
          value: "confess-dt"
        },
        {
          name: "Reaction Roles DATABASE",
          value: "rr=dt"
        },
        {
          name: "Audit Logs DATABASE",
          value: "audit-dt"
        },
        {
          name: "Confession DATABASE",
          value: "confess-dt"
        }
      ]
    }
  ]
}