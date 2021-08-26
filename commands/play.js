const ytdl = require('ytdl-core-discord');
const YouTube = require("youtube-sr").default;


module.exports = {
	name: 'play',
	description: 'music',
    aliases: ['stop', 'skip', 'quit', 'loop'],
    guildOnly: true,
    
	execute: async (message, args,client,command) => {
        if (!message.member.voice.channel)
        {
            return message.channel.send('You need to be in a channel to execute this command!');
        }
        if(command == 'play')
        {
            if(!args.length)
            {
                return message.channel.send('You have to specify a song to play');
            }
            //Yaari thing
            if(args.join(' ') == 'villager arik main theme')
            {
                console.log(args.join(' '))
                args = [];
                args[0] = "sigma";
                args[1] = "male";
                args[2] = "song";
            }
            let song = {};
            if (ytdl.validateURL(args[0])) 
            {
                const song_info = await ytdl.getInfo(args[0]);
                song = { title: song_info.videoDetails.title, url: song_info.videoDetails.video_url }
            } else {
                //If there was no link, we use keywords to search for a video. Set the song object to have two keys. Title and URl.
                const video_finder = async (query) =>{
                    const video_result = await YouTube.searchOne(query);
                    return video_result;
                }
                const video = await video_finder(args.join(' '));
                if (video){
                    song = { title: video.title, url: video.url, connection: null}
                } else {
                     message.channel.send('Error finding video.');
                }
            }
            client.queue[message.guild.id].push(song);
            if(client.queue[message.guild.id].length === 1)
            {
                try {
                    const connection = await message.member.voice.channel.join();
                    client.connection[message.guild.id] = connection;
                    video_player(message.guild, client.queue[message.guild.id][0], client, message);
                } catch (err) {
                    client.queue[message.guild.id] = [];
                    message.channel.send('There was an error connecting!');
                    throw err;
                }
            }
            else{
                const QueueMessage = {
                    color: 0x0099ff,
                    description: `[${song.title}](${song.url}) was added to the queue!`,
                };
                if(client.connection[message.guild.id] == null)
                {
                const connection = await message.member.voice.channel.join();
                client.connection[message.guild.id] = connection;
                }
                return message.channel.send({ embed: QueueMessage });
            }
        }
        else if(command === 'skip') skip_song(message, client);
        else if(command === 'stop') stop_song(message, client);
        else if(command === 'quit') quit_channel(message, client);
        else if(command === 'loop') loop_queue(message, client);
    },
};
const video_player = async (guild, song, client, message) => {
    const song_queue = client.queue[guild.id];
    console.log(`Music: Currently playing ${song.title} - [${guild.name}]`);
    //If no song is left in the server queue. Leave the voice channel and delete the key and value pair from the global queue.
    client.connection[guild.id].dispatcher = client.connection[guild.id].play(await ytdl(song.url, {highWaterMark: 1<<25}), { filter:"audioonly", type: 'opus' })
    .on('finish', () => {
        if(client.loopState[guild.id] === 'song')
        {
            video_player(guild, song,client, message);
        } else if (client.loopState[guild.id] === 'queue')
        {
            console.log("hey, queue loop")
            song_queue.push(song_queue.shift());
            console.log(song_queue);
            video_player(guild, client.queue[message.guild.id][0],client, message);
        }
        else
        {
            song_queue.shift();
            if(client.queue[message.guild.id][0])
            {
                video_player(guild, client.queue[message.guild.id][0],client, message);
            } else {
                client.connection[message.guild.id].disconnect();
                client.queue[message.guild.id] = [];
                client.connection[message.guild.id] = null;
                client.loopState[message.member.guild.id] = 'false';
                console.log(`Music: disconnected from voice channel - [${guild.name}]`);
            }
        }
        
        
    });
    const musicStartMessage = {
        color: 0x0099ff,
        description: `🎶 Now playing [${song.title}](${song.url})`,
    };
    await message.channel.send({ embed: musicStartMessage });
}

const skip_song = async (message, client) => {
    if (!message.member.voice.channel) return message.channel.send('You need to be in a channel to execute this command!');
    console.log(`Music: skipped song ${client.queue[message.guild.id][0].title} - [${message.member.guild.name}]`);
    if(!client.queue[message.guild.id]){
        return message.channel.send(`There are no songs in queue`);
    }
    client.queue[message.guild.id].shift();
    if(client.queue[message.guild.id][0])
    {
        video_player(message.guild,client.queue[message.guild.id][0],client,message);
    } else {
        const NoSongsMessage = {
            color: 0x0099ff,
            description: `There are no songs in the queue, disconnecting...`,
        };
        await message.channel.send({ embed: NoSongsMessage });
        client.connection[message.guild.id].disconnect();
		client.queue[message.guild.id] = [];
        client.connection[message.guild.id] = null;
        client.loopState[message.member.guild.id] = 'false';
        console.log(`Music: disconnected from voice channel - [${message.member.guild.name}]`);
    }
    
}

const stop_song = (message, client) => {
    if (!message.member.voice.channel) return message.channel.send('You need to be in a channel to execute this command!');
    client.connection[message.guild.id].dispatcher.pause();
    console.log(`Music: stopped song: ${client.queue[message.guild.id][0]} - [${message.member.guild.name}]`);
}

const quit_channel = (message, client) => {
    const inSameChannel = client.voice.connections.some((connection) => connection.channel.id === message.member.voice.channelID);
    console.log(`Music: disconnected from voice channel - [${message.member.guild.name}]`);
	if (inSameChannel)
	{
		message.guild.me.voice.channel.leave();
		client.queue[message.guild.id] = [];
        client.connection[message.guild.id] = null;
        client.loopState[message.member.guild.id] = 'false';
	}
}
const loop_queue = async (message, client) => {
        const LoopStateMessage = {
            color: 0x0099ff,
            description: ``,
    };
    console.log(client.loopState[message.member.guild.id]);
    if(client.loopState[message.member.guild.id] == 'false')
    {
        client.loopState[message.member.guild.id] = 'queue';
        LoopStateMessage.description = 'Looping the queue';
    }
    else if(client.loopState[message.member.guild.id] === 'queue')
    {
        client.loopState[message.member.guild.id] = 'song';
        LoopStateMessage.description = 'Looping the song';
    }
    else if(client.loopState[message.member.guild.id] === 'song')
    {
        client.loopState[message.member.guild.id] = 'false';
        LoopStateMessage.description = 'Looping disabled';
    }
    console.log(`Music: LoopState - ${client.loopState[message.member.guild.id]} - [${message.member.guild.name}]`);
    await message.channel.send({ embed: LoopStateMessage });
}