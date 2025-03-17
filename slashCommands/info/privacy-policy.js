const { MessageEmbed } = require('discord.js')
const {stripIndents} = require('common-tags')

module.exports = {
  name: "privacy-policy",
  ownerOnly: true,
  description: "Privacy-policy of skipper",
  execute: async(client, interaction, args) => {
   const embeds = new MessageEmbed()
   .setAuthor(client.user.username, client.user.displayAvatarURL())
   .setDescription(stripIndents`
   Privacy Policy

Last Updated: 8/8/24

Hi! this is Skipper

Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your data when you interact with our Discord bot.

1. Information We Collect
1.1. User Data
\`\`\`When you interact with our bot, we may collect certain information about your Discord account, including:

Username and Discriminator: Username and discriminator (e.g., User#0).
User ID: A unique identifier for Discord account.
Roles and Permissions: The roles and permissions you have within the server.
Presence Information: Online status, if the Guild Presences intent is enabled.\`\`\`
1.2. Server Data
\`\`\`We may also collect information about the servers you are a member of, such as:

Server ID: A unique identifier for the server.
Server Name: The name of the server.
Member Count: The number of members in the server.\`\`\`
2. How We Use Your Data
\`\`\`We use the collected data to provide and improve the functionality of the bot, including:

Providing Features: To deliver and manage the services and features of our bot.
Customizing Experience: To tailor interactions and responses based on your user data and presence.
Server Management: To help with server administration tasks, such as role management and member tracking.
Troubleshooting: To address issues and improve the performance of the bot.\`\`\`
3. Data Sharing and Disclosure
3.1. Third-Party Services
\`\`\`We do not sell or share your data with third-party services. However, we may use third-party services to assist with the bot’s functionality, such as hosting or analytics, which may have access to your data in the course of their operations. We ensure these services adhere to similar privacy standards.\`\`\`

3.2. Legal Compliance
\`\`\`We may disclose your data if required by law or to comply with legal processes.\`\`\`

4. Data Security
\`\`\`We implement reasonable measures to protect your data from unauthorized access, use, or disclosure. However, no method of transmission over the internet\`\`\`

5. User Rights
\`\`\`You have the right to:

Access: Request a copy of the data we hold about you.
Update: Request corrections to your data if it is inaccurate or outdated.
Delete: Request the deletion of your data from our systems.
To exercise these rights, please contact us at ( ateezalicia@gmail.com ). \`\`\`

6. Changes to This Policy
\`\`\`We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new Privacy Policy in the bot’s commands or via a server announcement.\`\`\`

7. Contact Us
\`\`\`If you have any questions about this Privacy Policy or our data practices, please contact us at ( ateezalicia@gmail.com ).\`\`\`

Best, Skipper!
   
   `)
   .setTimestamp()
   .setColor("GREEN")
   .setFooter("Privacy Policy")
   
   await interaction.reply({ embeds: [embeds], ephemeral: true})
  }
}