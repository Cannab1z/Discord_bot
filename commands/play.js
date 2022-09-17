const Discord = require('discord.js');
const ytdl = require('ytdl-core-discord');
const fetch = require('isomorphic-unfetch')
const ytdlc = require('ytdl-core');
const YouTube = require("youtube-sr").default;
const { getData, getPreview, getTracks } = require('spotify-url-info')(fetch);
const Genius = require("genius-lyrics");
const Client = new Genius.Client("nLNQUDVmfR055RfrdHOfYolv7dTqcG-ruxC1FDge4FWV1FdnppWIW9f2xu9tPAEb");


module.exports = {
	name: 'play',
	description: 'music',
    aliases: ['stop', 'skip', 'quit', 'loop', 'lyrics', 'seek'],
    guildOnly: true,
    
	execute: async (message, args,client,command) => {
        if (!message.member.voice.channel)
        {
            return message.channel.send('You need to be in a channel to execute this command!');
        }
        if(command == 'play')
        {
            try {
                if(!args.length)
                {
                    return message.channel.send('You have to specify a song to play');
                }
                let isPlaylist = false;
                let name = args.join(' ');
                if(args[0].substring(0,24) === "https://open.spotify.com")
                {
                    const data = await getPreview(args[0]);
                    if(data)
                    {
                        if(data.type === "track")
                        {
                            name = `${data.track} ${data.artist}`;
                        } else if (data.type === "playlist" || data.type === "album")
                        {
                            isPlaylist = true;
                            const dataPlaylist = await getTracks(args[0])
                            if(dataPlaylist)
                            {
                                let i = 0;
                                for(const track of dataPlaylist) {
                                    let query = `${track.name} ${track.artists[0].name}`;
                                    song = await video_finder(client, message, query);
                                    await add_to_queue(client, message, song, true);
                                    i++;
                                }
                                const QueueMessage = {
                                    color: 0x0099ff,
                                    description: `${i} songs were added to the queue!`,
                                };
                                return message.channel.send({ embed: QueueMessage });
                            }
                        }
                    }
                }
                if (ytdl.validateURL(args[0]))
                {
                    const song_info = await ytdl.getInfo(args[0]);
                    song = { title: song_info.videoDetails.title, url: song_info.videoDetails.video_url }
                    client.queue[message.guild.id].push(song);
                    await add_to_queue(client, message, song);
                } else {
                    //If there was no link, we use keywords to search for a video. Set the song object to have two keys. Title and URl.
                    song = await video_finder(client, message, name);
                    await add_to_queue(client, message, song);
                }
            } catch(err) {
                console.log(new Date() + err);
            }
        }
        else if(command === 'skip') skip_song(message, client);
        else if(command === 'stop') stop_song(message, client);
        else if(command === 'quit') quit_channel(message, client);
        else if(command === 'loop') loop_queue(message, client);
        else if(command === 'lyrics') lyrics_song(message, client, args);
        else if(command === 'seek') seek_song(message, client, args);
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
            song_queue.push(song_queue.shift());
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
const add_to_queue = async (client, message, song, isPlaylist=false) => {
    if(client.queue[message.guild.id].length === 1)
    {
        try {
            const connection = await message.member.voice.channel.join();
            client.connection[message.guild.id] = connection;
            await video_player(message.guild, client.queue[message.guild.id][0], client, message);
        } catch (err) {
            client.queue[message.guild.id] = [];
            message.channel.send('There was an error connecting!');
            throw err;
        }
    }
    else if(!isPlaylist){
        const QueueMessage = {
            color: 0x0099ff,
            description: `[${song.title}](${song.url}) was added to the queue!`,
        };
        return message.channel.send({ embed: QueueMessage });
    }
}
const video_finder = async (client, message, query) =>{
    const video_result = await YouTube.searchOne(query);
    let song = {}
    
    if(video_result)
    {
       song = { title: video_result.title, url: video_result.url, connection: null}
    } else {
         message.channel.send('Error finding video.');
         return;
    }
    client.queue[message.guild.id].push(song);
    return song;
}

const skip_song = async (message, client) => {
    if (!message.member.voice.channel) return message.channel.send('You need to be in a channel to execute this command!');
    const NoSongsMessage = {
        color: 0x0099ff,
        description: `There are no songs in the queue`,
    };
    if(client.queue[message.guild.id].length === 0){
        return await message.channel.send({ embed: NoSongsMessage });
    }
    client.queue[message.guild.id].shift();
    if(client.queue[message.guild.id][0])
    {
        console.log(`Music: skipped song ${client.queue[message.guild.id][0].title} - [${message.member.guild.name}]`);
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
const lyrics_helper = async (args) => {
    var lyrics = "";
    try
    {
        const searches = await Client.songs.search(args.join(' '));
        lyrics = await searches[0].lyrics();
    }
    catch(err) {
        lyrics = "NOT FOUND";
        console.log("err");
    }
    return lyrics;
}
const lyrics_song = async (message, client, args) => {
    var lyrics = "";
    for (let i = 0; i < 3; i++) {
        lyrics = await lyrics_helper(args);
        if(lyrics !== "NOT FOUND")
        {
            console.log(lyrics);
            break;
        }
    }
    const chunks = Discord.Util.splitMessage(lyrics);
    const embed = new Discord.MessageEmbed().setColor(0x0099ff);
    if (chunks.length > 1) {
        chunks.forEach((chunk) =>
          message.channel.send(
            embed
              .setDescription(chunk)));
    } else {
        message.channel.send(embed.setDescription(chunks[0]));
        }
    /*const LyricsMessage = {
        color: 0x0099ff,
        description: `${lyrics}`,
    };
    if(lyrics.length > 4096)
    {
        await message.channel.send(lyrics, { split: true});
    }
    else
    {
        await message.channel.send({embed: LyricsMessage});
    }*/
}
const seek_song = async (message, client, args) => {
    let guild = message.guild;
    let song = client.queue[message.guild.id][0];
    const song_queue = client.queue[guild.id];
    let stream = await ytdlc(song.url,{filter: 'audioonly', highWaterMark: 1<<25});
    const streamOptions = {
        seek: args[0],
        highWaterMark: 1<<25
    };
    client.connection[guild.id].dispatcher = client.connection[message.guild.id].play(stream, streamOptions, {type: 'opus'}).on("finish", () => {
        if(client.loopState[guild.id] === 'song')
        {
            video_player(guild, song,client, message);
        } else if (client.loopState[guild.id] === 'queue')
        {
            song_queue.push(song_queue.shift());
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
}