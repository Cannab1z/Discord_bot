module.exports = {
	name: 'clean',
	description: 'hey',
	execute(message, args) {
        flag = false;
        message.guild.members.cache.forEach(member => {
            if(member["nickname"] === "פוסי")
            {
                member.setNickname(member.user.username);
                flag = true;
            }
        });
        if(!flag)
        {
            const NoNickname = {
                color: 0x0099ff,
                description: `No member is currently called "פוסי"`,
            };
            message.channel.send({ embed: NoNickname });
        }
	},
};