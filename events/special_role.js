module.exports = {
	name: 'voiceStateUpdate',
	execute(oldMember, newMember, client) {
	    if(newMember.channelID != oldMember.channelID)
        {
            let special_role_users = newMember.member.guild.roles.cache.find(role => role.name === 'Gever').members.map(m=>m.user.tag);
            special_role_users.forEach((user) => {
            if(user === newMember.member.user.tag)
            {
                let number = Math.floor(Math.random() * 100);
                console.log(number);
                if(number < 5)
                {
                console.log(`kicked ${newMember.member.nickname}`)
                newMember.member.voice.kick();
                if(newMember.member.id === '253928420227022848')
                {
                    let disconecter = newMember.member.guild.members.cache.find(member => member.id == '197459744208715776');
                    if(disconecter)
                    {
                    let channel = newMember.member.guild.channels.cache.filter(channel => channel.type == "text");
                    channel.first().send(`${newMember.member.guild.members.cache.find(member => member.id == '197459744208715776').nickname} disconnected ${newMember.member.nickname}`);
                    }
                }
                }
            }});
        }
    },
};