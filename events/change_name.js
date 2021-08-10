module.exports = {
	name: 'guildMemberUpdate',
	execute(oldMember, newMember, client) {
        if(oldMember.nickname !== newMember.nickname)
        {
            if(oldMember.id === '197459744208715776')
            {
                newMember.setNickname("איצקו");
            }
        }
	},
};