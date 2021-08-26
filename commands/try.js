module.exports = {
	name: 'try',
	description: 'try',
	execute(message, args) {
        const exampleEmbed = {
                color: 0x0099ff,
                description: ``,
        };
        if(args[0] === 'hey')
        {
            exampleEmbed.description = 'heyyyy';
        }
        else
        {
            exampleEmbed.description = 'hey';
        }
        message.channel.send({ embed: exampleEmbed });
	},
};