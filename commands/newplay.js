const ytdl = require('ytdl-core-discord');
const ytSearch = require('yt-search');

module.exports = {
	name: 'newplay',
	description: 'music',
    aliases: ['stop', 'skip'],
    guildOnly: true,
    
	execute: async (message, args,client,command) => {
        console.log("text");
        if (!message.member.voice.channel)
        {
            return message.channel.send('You need to be in a channel to execute this command!');
        }
        if(command == 'newplay')
        {
            if(!args.length)
            {
                return message.channel.send('You have to specify a song to play');
            }
            let song = {};
            if (ytdl.validateURL(args[0])) 
            {
                const song_info = await ytdl.getInfo(args[0]);
                song = { title: song_info.videoDetails.title, url: song_info.videoDetails.video_url }
            } else {
                //If there was no link, we use keywords to search for a video. Set the song object to have two keys. Title and URl.
                const video_finder = async (query) =>{
                    const video_result = await ytSearch(query);
                    return (video_result.videos.length > 1) ? video_result.videos[0] : null;
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
                client.queue[message.guild.id].push(song);
                return message.channel.send(` **${song.title}** added to queue!`);
            }
        }
        else if(command === 'skip') skip_song(message, client);
        else if(command === 'stop') stop_song(message, client);
    },
};
const video_player = async (guild, song, client, message) => {
    const song_queue = client.queue[guild.id];

    //If no song is left in the server queue. Leave the voice channel and delete the key and value pair from the global queue.
    if (!song) {
        song_queue.voice_channel.leave();
        client.queue[guild.id] = [];
        return;
    }
    client.connection[guild.id].play(await ytdl(song.url), { type: 'opus' })
    .on('finish', () => {
        song_queue.shift();
        video_player(guild, song_queue.songs[0]);
    });
    await message.channel.send(`🎶 Now playing **${song.title}**`)
}

const skip_song = (message, client) => {
    if (!message.member.voice.channel) return message.channel.send('You need to be in a channel to execute this command!');
    if(!client.queue[message.guild.id]){
        return message.channel.send(`There are no songs in queue`);
    }
    console.log("test");
    client.queue[message.guild.id].connection.dispatcher.end();
}

const stop_song = (message, client) => {
    if (!message.member.voice.channel) return message.channel.send('You need to be in a channel to execute this command!');
    client.queue[message.guild.id] = [];
    client.connection[message.guild.id].dispatcher.end();
}