const axios = require('axios');
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: "breached",
  description: "Check if your email or passwords have been breached",
  options: [
    {
      name: "email",
      description: "Enter your email",
      required: true,
      type: "STRING"
    }
  ],
  execute: async(client, interaction, args) => {
    const email = interaction.options.getString('email');
    const options = {
      method: 'GET',
      url: 'https://breachdirectory.p.rapidapi.com/',
      params: {
        func: 'auto',
        term: email
      },
      headers: {
        'x-rapidapi-key': '42f746455cmsh9d845be6ec395c9p161a61jsn96327c14229c',
        'x-rapidapi-host': 'breachdirectory.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      var resultString = '';
      response.data.result.forEach(async (item, index) => {
        const email = item.email;
        const password = item.password || 'None';
        const has_password = item.has_password;
        const hash_password = item.hash;
        const sha1 = item.sha1;
        const sources = item.sources;
        resultString += `**Result ${index + 1}**:\n> Email: ||${email}||\n> Has password: ${has_password}\n> Password: ${password}\n> Sources: ${sources}\n\n`;
      });
      var type;
      if (response.data.found > 0) {
        type = "Breached Email Detected!"
      } else {
        type = "No breaches detected"
      }
      var combine = `I have found ${response.data.found} breach(s) for the email: ||${email}||\n\n` + `${resultString}` + `Your email has been breached and you don't know what to do? See [this link](https://www.webroot.com/us/en/resources/tips-articles/what-do-i-do-when-my-email-has-been-hacked-and-spam-is-sent-to-my-contacts) for guidance.`
      const embed = new MessageEmbed()
      .setAuthor(interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true }))
      .setTitle(type)
      .setDescription(combine)
      .setColor("BLUE")
      .setTimestamp()
      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error(error);
      return interaction.reply({ content: `${error.message}`, ephemeral: true })
    }
  }
}