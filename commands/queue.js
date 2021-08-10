module.exports = {
	name: 'queue',
	description: 'hey',
	execute(message, args,client) {
        const queue = client.queue[message.guild.id];
        let queueString = "";
        queue.forEach(song => {
            queueString += song.title + ",\n";
        });
        const exampleEmbed = {
                color: 0x0099ff,
                description: `The Queue is: ${queueString}`,
        };
        message.channel.send({ embed: exampleEmbed });
	},
};