module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`Logged in as ${client.user.tag}!`);
		client.queue = {};
		client.connection = {};
		client.guilds.cache.forEach(guild => {
			client.queue[guild.id] = [];
			client.connection[guild.id] = null;
		});
		//for (guild of client.guilds) client.queue[guild.id] = [];
	},
};