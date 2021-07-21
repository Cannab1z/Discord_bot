const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const config = require('./config.json');
const prefix = config.prefix;
const ytdl = require('ytdl-core-discord');
const fs = require('fs');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

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

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;

	try {
		client.commands.get(command).execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

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
  /*let number = Math.floor(Math.random() * 100);
  if(number < 1)
  {
    let channels = client.guilds.cache.find(guild => guild.id == '803651327682543626').channels.cache.filter(channel => channel.type == "text");
    channels.find(channel => channel.id == '803652300408488017').send("/play פסקול חיי");
  }*/
}, 10000);

client.on('voiceStateUpdate', (oldMember, newMember) =>{
  if(newMember.channelID == oldMember.guild.afkChannelID)
  {
    console.log(`${newMember.member.nickname} moved to afk`);
    afk_users.push({member: newMember.member, time: new Date(), channel: newMember});
  }
});

client.on('message', async message => {
	if(message.content === '$play' || message.content === '$stop')
  {
    if (message.member.voice.channel) {
      const connection = await message.member.voice.channel.join();
      // Create a dispatcher
      const dispatcher = connection.play(await ytdl('https://www.youtube.com/watch?v=xmeCr9QPhkA'), {type: 'opus'});
      if(message.content == '$stop')
        {
          dispatcher.destroy();
        }
        dispatcher.on('start', () => {
          console.log('audio.mp3 is now playing!');
        });

        dispatcher.on('finish', () => {
          console.log('audio.mp3 has finished playing!');
        });

        // Always remember to handle errors appropriately!
        dispatcher.on('error', console.error);
        
    }
  }
  
});

client.on('message', async message => {
  if(message.content == '$quit')
  {
    message.guild.me.voice.channel.leave();
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