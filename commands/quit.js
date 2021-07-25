module.exports = {
	name: 'quit',
	description: 'quit',
	execute(message, args, client) {
		if(message.content == '$quit')
		{
			const inSameChannel = client.voice.connections.some((connection) => connection.channel.id === message.member.voice.channelID);
			  if (inSameChannel)
			  {
			  	message.guild.me.voice.channel.leave();
				client.queue[message.guild.id] = [];
			  }
		}
	},
};