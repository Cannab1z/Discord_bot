module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`ready: Logged in as ${client.user.tag}!`);
		client.queue = {};
		client.fun = {};
		client.connection = {};
		client.loop = {};
		client.loopState = {};
		client.guilds.cache.forEach(guild => {
			client.queue[guild.id] = [];
			client.connection[guild.id] = null;
			client.loop[guild.id] = [];
			client.loopState[guild.id] = 'false';
			client.fun[guild.id] = 'true';
		});
		
	},
};