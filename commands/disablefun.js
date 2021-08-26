module.exports = {
	name: 'disablefun',
	description: 'disablefun',
	execute(message, args,client) {
        if(message.member.hasPermission("ADMINISTRATOR"))
        {
                const exampleEmbed = {
                color: 0x0099ff,
                description: `?fun is disabled by <@${message.member.id}>`,
                };
                message.channel.send({ embed: exampleEmbed });
                client.fun[message.guild.id] = 'false';
        } else
        {
                const exampleEmbed = {
                        color: 0x0099ff,
                        description: `You do not have permission to disable ?fun`,
                        };
                        message.channel.send({ embed: exampleEmbed });
        }
        
	},
};