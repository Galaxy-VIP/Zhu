const API_ERROR = 'API ERROR';
const API_KEY = "c6d9f08382324a515c2f450053f79b86";
const fetch = require("node-fetch")
const { MessageEmbed } = require("discord.js")
module.exports = {
  name: "weather",
  description: "Get weather information",
  options: [
     {
       name: "location",
       description: "Enter a location",
       type: "STRING",
       required: true
   }
  ],
 
  execute: async (client, interaction, args) => {
    const place = interaction.options.getString("location");
    const response = await weather(place);
    await interaction.reply(response);
  },
};
 
async function getJson(url, options) {
  try {
    const response = options ? await fetch(url, options) : await fetch(url);
    const json = await response.json();
    return {
      success: response.status === 200 ? true : false,
      status: response.status,
      data: json,
    };
  } catch (error) {
    console.error(error);
    return { success: false, error: error };
  }
}
 
async function getJson2(url, options) {
    try {
      const response = options ? await fetch(url, options) : await fetch(url);
      const json = await response.json();
      return {
        success: response.status === 200 ? true : false,
        status: response.status,
        data: json,
      };
    } catch (error) {
      console.error(error);
      return { success: false, error: error };
    }
  }
  
  async function weather(place) {
    const response = await getJson(
      `http://api.weatherstack.com/current?access_key=${API_KEY}&query=${place}`
    );
    if (!response.success) return API_ERROR;
  
    const json = response.data;
    if (!json.request) return `No city found matching \`${place}\``;
  
  const embed = new MessageEmbed()
    //.setAuthor(interaction.guild.name, interaction.guild.iconURL({ dynamic: true}))
    .setTitle('Weather Station')    
    .setColor('BLUE')
    .setImage("https://cdn.discordapp.com/attachments/1129094438669520956/1208465076206706749/weather.png?ex=65e361ce&is=65d0ecce&hm=00cb0e6338b26b46af6f410c7b93cbe97932d0bcf1ae06f37a536f91708d3eb3&")
    .setDescription(`Current weather at ${json.location?.name}`)   
    .setThumbnail(json.current?.weather_icons[0])
    .addFields(
        { name: "City", value: json.location?.name || "NA", inline: true },
        { name: "Region", value: json.location?.region || "NA", inline: true },
        { name: "Country", value: json.location?.country || "NA", inline: true },
        { name: "Weather condition", value: json.current?.weather_descriptions[0] || "NA", inline: true },
        { name: "Date", value: json.location?.localtime.slice(0, 10) || "NA", inline: true },
        { name: "Time", value: json.location?.localtime.slice(11, 16) || "NA", inline: true },
        { name: "Temperature", value: `${json.current?.temperature}°C`, inline: true },
        { name: "CloudCover", value: `${json.current?.cloudcover}%`, inline: true },
        { name: "Wind Speed", value: `${json.current?.wind_speed} km/h`, inline: true },
        { name: "Wind Direction", value: json.current?.wind_dir || "NA", inline: true },
        { name: "Wind Degree", value: `${json.current?.wind_degree.toString()}°` || "NA", inline: true },
        { name: "Pressure", value: `${json.current?.pressure} mb`, inline: true },
        { name: "Precipitation", value: `${json.current?.precip.toString()} mm`, inline: true },
        { name: "Humidity", value: json.current?.humidity.toString() || "NA", inline: true },
        { name: "Visual Distance", value: `${json.current?.visibility} km`, inline: true },
        { name: "UV Index", value: json.current?.uv_index.toString() || "NA", inline: true }              
    )
    .setFooter(`Last checked at ${json.current?.observation_time} GMT`);
    //.setFooter({ text: `Last checked at ${json.current?.observation_time} GMT` });
 
  return { embeds: [embed] };
}