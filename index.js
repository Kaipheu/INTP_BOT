const fs = require('fs');
const YAML = require('yaml');

const { Client, Intents, MessageEmbed } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MESSAGES,Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

const { token } = require('./config.json');
const config_file = fs.readFileSync('bot.yml', 'utf8')

const CONFIG = YAML.parse(config_file).propositions;
const exp = new RegExp(CONFIG.schemas);


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
	if(msg.channelId == CONFIG["channel"]){
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

// function name(params) {
  
// }

client.on('messageReactionAdd', async (MessageReaction, user) => {
  if(user.bot) return ;
  // console.log(MessageReaction['users']);
  let  MsgReactPour = MessageReaction['message']["reactions"]["cache"].get('👍');
  let  MsgReactContre = MessageReaction['message']["reactions"]["cache"].get('👎');
  // console.log(MsgReactPour["users"]["cache"]);
  // console.log(MsgReactContre["users"]["cache"]);
  exp().then(async MapXp => {
      let Pour = 0, Contre = 0;
      MsgReactPour["users"]["cache"].forEach((V,K)=> {
        let val = MapXp.get(K);
        if(!V["bot"]){
          if( val ){
            Pour += val.xp;
          }else{
            Pour += 1;
          }
        }
      });
      MsgReactContre["users"]["cache"].forEach((V,K)=> {
        let val = MapXp.get(K);
        if(!V["bot"]){          
          if( val ){
            Contre += val.xp;
          }else{
            Contre += 1;
          }
        }
      });
      if(BigObj[MessageReaction.message.id]){
        BigObj[MessageReaction.message.id].edit({ embeds: [generateTable(Pour,Contre)]});
       }
  });
});


client.on('messageReactionRemove',async (MessageReaction, user) => {
  if(user.bot) return ;
   if(BigObj[MessageReaction.message.id]){
    BigObj[MessageReaction.message.id].edit({ embeds: [generateTable(0,1)]});
   }
});

client.on('error', err => {
   console.warn(err);
});

client.login(token);
