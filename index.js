const { Client, Intents, MessageEmbed } = require('discord.js');
const { token, guild_id, channel_id } = require('./config.json');
const client = new Client({ intents: [Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MESSAGES,Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });
const REenTete = new RegExp('Proposition (\\d+) :');
const exp = require('./xperiance.js');
let leaderBoard = "";

let BigObj = {}

client.once('ready', () => {
	console.log('Ready!');
});


function generateTable(pour, contre){
  dd = exp()
  return new MessageEmbed()
	.setColor('#0099ff')
	.setTitle('Table de vote :')
	.addFields(
		{ name: 'Pour',   value: pour.toString(), inline: true   },
    { name: 'Contre', value: contre.toString(), inline: true }
	)
}

client.on('messageCreate', async msg => {
	if(msg.channelId == channel_id){
    res = msg.content.match(REenTete)
    if(res){
      thread = await msg.startThread({"name": res[0]});
      cmp =  await thread.send({ embeds: [generateTable(0,0)] });
      BigObj[msg.id] = cmp;
      Promise.all([
        msg.react('👍'),
        msg.react('👎')
      ]);
    }
	}
});


/*
client.on('messageReactionAdd', (MessageReaction, user) => {
  if(user.bot) return ;
  if(BigObj[MessageReaction.message.id]){
    xx = await exp();
    console.log(xx);
    BigObj[MessageReaction.message.id].edit({ embeds: [generateTable(1,0)]});
   }
});
*/
client.on('messageReactionRemove', (MessageReaction, user) => {
  if(user.bot) return ;
   if(BigObj[MessageReaction.message.id]){
    BigObj[MessageReaction.message.id].edit({ embeds: [generateTable(0,1)]});
   }
});
client.on('error', err => {
   console.warn(err);
});

client.login(token);
