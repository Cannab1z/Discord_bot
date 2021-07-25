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
                            value: '$play, $stop, $quit',
                        },
                    ],
                };
                message.channel.send({ embed: exampleEmbed });
        } catch {console.error()}
		
	},
};