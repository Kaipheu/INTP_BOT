const https = require('https');
const { Client, Intents } = require('discord.js');
const { token, guild_id, channel_id } = require('./config.json');
const client = new Client({ intents: [Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MESSAGES,Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });
const REenTete = new RegExp('Proposition (\\d+) :');
let leaderBoard = "";

const options = {
  hostname: 'mee6.xyz',
  port: 443,
  path: '/api/plugins/levels/leaderboard/' + guild_id,
  method: 'GET'
};

BigList = []

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

// function attente_react(msg) {
//   const filter = (reaction, user) => reaction.emoji.name === '👍' || reaction.emoji.name === '👎';
//   msg.awaitReactions({time: 1000})
//     .then(collected =>{ 
//       console.log(`Collected ${JSON.stringify(collected)} reactions`);
//       attente_react(msg)})
//     .catch(console.error);
// }

client.once('ready', () => {
	console.log('Ready!');
});

client.on('messageCreate', async msg => {
	if(msg.guildId == guild_id && msg.channelId == channel_id){
    res = msg.content.match(REenTete)
    if(res){
      thread = msg.startThread({"name": res[0]});
      BigList.push(msg);
      Promise.all([
        msg.react('👍'),
        msg.react('👎')
      ]);
      thread.then(res => res.send("Pour : 0\nContre : 0"));
    }

	}
});

client.on('error', err => {
   console.warn(err);
});

client.login(token);

function actualisation() {
  console.log("actu");
  BigList.forEach(msg => {
    console.log(msg.content)
    msg.fetch()
    const reacs = msg.reactions.cache.filter(reaction => reaction.emoji.name === '👍' || reaction.emoji.name === '👎');
    console.log(reacs)
  });
}

setInterval(actualisation, 1500);