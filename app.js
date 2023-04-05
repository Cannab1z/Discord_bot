//modules requires
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});
client.commands = new Collection();
const prefix = process.env.prefix;
const ytdl = require('ytdl-core-discord');
const fs = require('node:fs');
const path = require('node:path');
const { listenerCount } = require('events');

//adding files
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

//requiring commands and events
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file)
	const command = require(filePath);
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
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
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	console.log(interaction);
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = interaction.client.commands.get(interaction.commandName);
	console.log(client.commands);
	console.log("----------------------");
	console.log(client.commands.get("play"))
	console.log(message)
        if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

//afk related events
const afk_users = [];

/*client.setInterval(() => {
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
}, 60000);*/

client.on('voiceStateUpdate', (oldMember, newMember) =>{
  if(newMember.channelID == oldMember.guild.afkChannelID)
  {
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
client.on('messageCreate', message => {
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

//debug

client.on('debug', console.log);
//login token
client.login(process.env.token);
