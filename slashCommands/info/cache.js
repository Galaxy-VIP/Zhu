const ITERATIONS = 100_000;
const MAX_RANDOM = 10_000;
let start, end;
const ArrayCache = [];

const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "cache",
    description: "Caching benchmark",
    execute: async (client, interaction, args) => {
        start = Date.now();
for (let i = 0; i < ITERATIONS; i++) {
	const random = Math.floor(Math.random() * MAX_RANDOM);
	if (!ArrayCache.includes(random)) {
		ArrayCache.push(random);
	}
}
end = Date.now();
console.log(`ArrayCache: ${end - start}ms`);


const SetCache = new Set();

start = Date.now();
for (let i = 0; i < ITERATIONS; i++) {
	const random = Math.floor(Math.random() * MAX_RANDOM);
	SetCache.add(random);
}
end = Date.now();
console.log(`SetCache: ${end - start}ms`);


const MapCache = new Map();

start = Date.now();
for (let i = 0; i < ITERATIONS; i++) {
	const random = Math.floor(Math.random() * MAX_RANDOM);
	MapCache.set(random, true);
}
end = Date.now();
console.log(`MapCache: ${end - start}ms`);


const ObjectCache = {};

start = Date.now();
for (let i = 0; i < ITERATIONS; i++) {
	const random = Math.floor(Math.random() * MAX_RANDOM);
	ObjectCache[random] ||= true;
}
end = Date.now();
console.log(`ObjectCache: ${end - start}ms`);
        const embed = new MessageEmbed()
        .setColor("BLUE")
        .setAuthor("caching Benchmark", interaction.member.displayAvatarURL({ dynamic: true }))
        .addField("Array cache", `${end - start}ms`)
        .addField("Set cache", `${end - start}ms`)
        .addField("Map cache", `${end - start}ms`)
        .addField("Object cache", `${end - start}ms`)
        .setTimestamp()
        return interaction.reply({ embeds: [embed]})
    }
}