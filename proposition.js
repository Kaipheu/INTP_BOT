const fs = require('fs');
const YAML = require('yaml');

const { Client, Intents, MessageEmbed, MessageFlags } = require('discord.js');
const { token } = require('./config.json');
const client = new Client({ intents: [Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MESSAGES,Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

const config_file = fs.readFileSync('bot.yml', 'utf8');
const CONFIG = YAML.parse(config_file).propositions;
const REenTete = new RegExp(CONFIG.schemas);

client.once('ready', () => {
	console.log('Ready!');
});

client.on('messageCreate', async msg => {  
  if(msg.bot) return ;
  if(msg.channel != CONFIG.channel) return ;
  if(!msg.content.match(REenTete)){
    msg.remove();
    msg.author.createDM().then(DM => {
      DM.send({
      content : `Attention il faut respecter le format Proposition X :`
    })});
  }
  msg.react('👍');
  msg.react('👎');
  msg.react('🏳️');
});

client.on('messageReactionAdd', async (MessageReaction, user) => {
  if(user.bot) return ;
  if(MessageReaction.message.channel != CONFIG.channel) return ;
  if(!MessageReaction.message.content.match(REenTete)) return ;
  if(MessageReaction.emoji?.name == ('👍') ||
     MessageReaction.emoji?.name == ('👎') ||
     MessageReaction.emoji?.name == ('🏳️')) return ;
  MessageReaction.remove();
  user.createDM().then(DM => {
    DM.send({
    content : `Seulement: 👍, 👎, 🏳️ sont autorisés\n${MessageReaction.message.url}`
  })});
});

client.on('error', err => {
   console.warn(err);
});

client.login(token);