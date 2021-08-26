module.exports = {
	name: 'enablefun',
	description: 'enablefun',
	execute(message, args,client) {
        if(message.member.hasPermission("ADMINISTRATOR"))
        {
                const exampleEmbed = {
                color: 0x0099ff,
                description: `?fun is enabled by <@${message.member.id}>`,
                };
                message.channel.send({ embed: exampleEmbed });
                client.fun[message.guild.id] = 'true';
        } else
        {
                const exampleEmbed = {
                        color: 0x0099ff,
                        description: `You do not have permission to enable ?fun`,
                        };
                        message.channel.send({ embed: exampleEmbed });
        }
        
	},
};