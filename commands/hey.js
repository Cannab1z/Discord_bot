const Discord = require('discord.js');
module.exports = {
	name: 'hey',
	description: 'hey',
	execute(message, args) {
        try{
                /*const exampleEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('kick')
                .setFooter('hey');
                message.channel.send(exampleEmbed);*/
                const exampleEmbed = {
                    color: 0x0099ff,
                    description: 'hey yaari',
                };
                message.channel.send({ embed: exampleEmbed });
        } catch {console.error()}
		
	},
};