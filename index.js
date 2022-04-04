const https = require('https');
const { Client, Intents } = require('discord.js');
const { token, guild_id, channel_id } = require('./config.json');
const client = new Client({ intents: [Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MESSAGES] });
const REenTete = new RegExp('Proposition (\\d+) :');
let leaderBoard = "";

const options = {
  hostname: 'mee6.xyz',
  port: 443,
  path: '/api/plugins/levels/leaderboard/' + guild_id,
  method: 'GET'
};

// const req = https.request(options, (res) => {
//   res.on('data', (d) => {
//     leaderBoard += d;
//   });
//   res.on('end', (d) => {
//     leaderBoard = JSON.parse(leaderBoard);
//     //process.stdout.write(JSON.stringify(leaderBoard));
//   });
// });

//req.end();

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

client.on('messageCreate', async msg => {
	if(msg.guildId == guild_id && msg.channelId == channel_id){
    res = msg.content.match(REenTete)
    if(res){
      thread = msg.startThread({"name": res[0]});
      msg.react('👍');
      msg.react('👎');
      thread.then(res => res.send("Pour : 0\nContre : 0"));
    }

	}
});

client.on('error', err => {
   console.warn(err);
});

client.login(token);


