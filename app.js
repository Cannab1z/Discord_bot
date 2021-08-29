//modules requires
const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const config = require('./config.json');
const prefix = config.prefix;
const ytdl = require('ytdl-core-discord');
const fs = require('fs');

//adding files
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

//requiring commands and events
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

//activating commands to files accordingly
client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) return;

	try {
		command.execute(message, args,client,commandName);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

//afk related events
const afk_users = [];

client.setInterval(() => {
  afk_users.forEach((user, index, object)=>{
    var date = new Date();
    var mins = (date - user.time) / (1000 *60 );
    //if a member leaves afk sooner
    if(user.member.voice.channelID != user.member.guild.afkChannelID)
    {
      afk_users.splice(index, 1);
      console.log(`afk: user ${user.member.nickname} (${user.member.user.tag}) left afk now`)
    }
    if(mins >= 5)
    {
      if(user.channel.channelID == user.member.guild.afkChannelID)
      {
        user.member.voice.kick();
        console.log(`afk: disconnected ${user.member.nickname} (${user.member.user.tag}) - ${user.member.guild.name}`);
        afk_users.shift();
        return;
      }
      else
      {
        afk_users.shift();
      }
    }
  })
}, 60000);

client.on('voiceStateUpdate', (oldMember, newMember) =>{
  if(newMember.channelID == oldMember.guild.afkChannelID)
  {
    oldMember.member.voice.channel.joi
    console.log(`afk: ${newMember.member.nickname} (${newMember.member.user.tag}) moved to afk - [${newMember.member.guild.name}]`);
    afk_users.push({member: newMember.member, time: new Date(), channel: newMember});
  }
  if(oldMember.id === client.user.id)
  {
    if(newMember.channelID === null)
    {
      client.queue[oldMember.member.guild.id] = [];
      client.connection[oldMember.member.guild.id] = null;
    }
  }
});
client.on('message', message => {
  if(message.content === '?fun')
  {
    console.log(client.fun[message.guild.id]);
    if(client.fun[message.guild.id] === 'true')
    {
      const channels = message.guild.channels.cache.filter(c => c.type === 'voice');
      const members = [];
      for (const [channelID, channel] of channels) {
        for (const [memberID, member] of channel.members) {
        members.push(member);
        }
      }
      members.forEach((member) => {
        let number = Math.floor(Math.random() * 100);
        if(number < 5)
        {
          console.log(`?fun: ${member.nickname} Got Disconnected - [${message.guild.name}]`);
          member.voice.kick();
          return;
        }
      })
    } else
    {
      return;
    }
  }
});
//login token
client.login(config.token);