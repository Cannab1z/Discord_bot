module.exports = {
	name: 'help',
	description: 'help',
	execute(message, args) {
        try{
                /*const exampleEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('kick')
                .setFooter('hey');
                message.channel.send(exampleEmbed);*/
                const exampleEmbed = {
                    color: 0x0099ff,
                    description: 'Ima shel minran',
                    fields: [
                        {
                            name: 'Music',
                            value: 'play\n skip\n stop\n quit\n loop\n queue\n',
                        },
                        {
                            name: 'Moderation',
                            value: 'disablefun\n enablefun',
                        },
                        {
                            name: 'Other',
                            value: 'clean\n ?fun\n hey\n',
                        },
                    ],
                };
                message.channel.send({ embed: exampleEmbed });
        } catch {console.error()}
		
	},
};