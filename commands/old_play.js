/*const ytdl = require('ytdl-core-discord');
const ytSearch = require('yt-search');
module.exports = {
	name: 'play',
	description: 'music',
    aliases: ['stop'],
    guildOnly: true,
    
	execute: async (message, args,client,command) => {
            if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
            console.log("nay");
            if(args.length)
            {
                console.log("yay");
                const video_finder = async (query) =>{
                    const video_result = await ytSearch(query);
                    return (video_result.videos.length > 1) ? video_result.videos[0] : null;
                }
                const video = await video_finder(args.join(' '));
                if (video){
                    song = { title: video.title, url: video.url }
                } else {
                     message.channel.send('Error finding video.');
                }
                const dispatcher = connection.play(await ytdl(video.url), { type: 'opus' });
                dispatcher.on('start', () => {
                    console.log('music is playing!');
                    const exampleEmbed = {
                        color: 0x0099ff,
                        description: `Playing: [${video.title}](${video.url}})`,
                };
                    message.channel.send({ embed: exampleEmbed });
                });
    
                dispatcher.on('finish', () => {
                    console.log('audio.mp3 has finished playing!');
                });
                dispatcher.on('error', console.error);
                if(message.content == '$stop')
                {
                console.log("music has stopped");
                dispatcher.destroy();
                }
            }
        }
    },
};*/