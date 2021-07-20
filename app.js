const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

var afk_users = [];

client.setInterval(() => {
  afk_users.forEach((user)=>{
    console.log(user.member.nickname);
    var date = new Date();
    var mins = (date - user.time) / (1000 *60 );
    console.log(mins);
    if(mins >= 5)
    {
      if(user.channel.channelID == user.member.guild.afkChannelID)
      {
        user.member.voice.kick();
        console.log(`kicked ${user.member.nickname}`);
        //console.log(`kicked ${user}`);
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