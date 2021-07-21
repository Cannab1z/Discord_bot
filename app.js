const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

const afk_users = [];

client.setInterval(() => {
  afk_users.forEach((user)=>{
    var date = new Date();
    var mins = (date - user.time) / (1000 *60 );
    console.log(`user ${user.member.nickname} was in afk ${mins} mins`);
    if(mins >= 5)
    {
      if(user.channel.channelID == user.member.guild.afkChannelID)
      {
        user.member.voice.kick();
        console.log(`kicked ${user.member.nickname}`);
        afk_users.shift();
        return;
      }
      else
      {
        console.log(`${user.member.nickname} left afk`);
        afk_users.shift();
      }
    }
  })
}, 10000);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

  });

client.on('voiceStateUpdate', (oldMember, newMember) =>{
  if(newMember.channelID == oldMember.guild.afkChannelID)
  {
    console.log(`${newMember.member.nickname} moved to afk`);
    afk_users.push({member: newMember.member, time: new Date(), channel: newMember});
  }
  else if(newMember.channelID != oldMember.channelID)
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
            let channel = newMember.member.guild.channels.cache.filter(channel => channel.type == "text");
            channel.first().send(`${newMember.member.guild.members.cache.find(member => member.id == '197459744208715776').nickname} kicked ${newMember.member.nickname}`);
          }
        }
      }
    });
  }
});


/*client.on('message', (message) => {
  //var guild = new Discord.Guild();
  //guild = client.guilds.resolveID
  console.log(message.guild.afkChannelID + " hey ");
  //console.log(message.client.user);
  console.log(message.guild.id)
  //if(message.client)
  //console.log(message.guild.afkChannel.members);
  let members_arr = message.guild.afkChannel.members.array();
  members_arr.forEach((member)=>{
    console.log(member.nickname);
  })
});*/

client.login(config.token);