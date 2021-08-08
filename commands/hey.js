const Discord = require('discord.js');
module.exports = {
	name: 'hey',
	description: 'hey',
	execute(message, args) {
        const exampleEmbed = {
                color: 0x0099ff,
                description: `Hello **${message.member.nickname}**`,
        };
        message.channel.send({ embed: exampleEmbed });
	},
};