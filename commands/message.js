module.exports = {
	name: 'hey',
	description: 'hey',
	execute(message, args) {
		message.channel.send(`Hello ${message.member.nickname}`);
	},
};