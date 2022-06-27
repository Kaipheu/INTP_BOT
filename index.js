const fs = require('fs');
const YAML = require('yaml');

const { Client, Intents, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9')

const xp = require("./xperiance");

const client = new Client({ intents: [Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MESSAGES,Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

const { token, appID } = require('./config.json');
const { exit } = require('process');
const config_file = fs.readFileSync('bot.yml', 'utf8')

const CONFIG = YAML.parse(config_file).propositions;
const exp = new RegExp(CONFIG.schemas);

const rest = new REST({ version: '9' }).setToken(token);

function compteVote(poderation,vote) {
  let totale = 0;
  vote.forEach((V,K)=> {
    let val = poderation.get(K);
    if(!V["bot"]){
      if( val ){
        if (val.message_count >= CONFIG.seuil) totale += 1;
      }
    }
  });
  return totale;
}

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
	if (interaction.commandName === 'vote') {
    if(!interaction.channel.isThread()){
      interaction.reply({
        content: "Cette commande ne fonctionne que dans les propostions",
        ephemeral: true })
        return 0;
    }
    msg = await interaction.channel.fetchStarterMessage();
    msg = await msg.fetch();
    MsgReactPour = msg["reactions"]["cache"].get('👍')?.users;
    MsgReactContre = msg["reactions"]["cache"].get('👎')?.users;
    MsgReactBlanc = msg["reactions"]["cache"].get('🏳️')?.users;
    xp().then(async MapXp => {
      let Pour = 0, Contre = 0, Blanc = 0;
      res = await Promise.all([
          MsgReactPour?.fetch(),
          MsgReactContre?.fetch(),
          MsgReactBlanc?.fetch()
        ]
      );
      Pour = MsgReactPour ? compteVote(MapXp,res[0]) : 0;
      Contre = MsgReactContre ? compteVote(MapXp,res[1]) : 0;
      Blanc = MsgReactBlanc ? compteVote(MapXp,res[2]) : 0;
      interaction.reply({ embeds: [generateTable(Pour,Contre, Blanc)]});
    });
	}
});

client.once('ready', () => {
	console.log('Ready!');
});


function generateTable(pour, contre, blanc ){
  return new MessageEmbed()
	.setColor('#0099ff')
	.setTitle('Table de vote :')
	.addFields(
		{ name: 'Pour',   value: pour.toString(), inline: true   },
    { name: 'Contre', value: contre.toString(), inline: true },
    { name: 'Blanc', value: blanc.toString(), inline: true }
	)
}
client.on('messageCreate', async msg => {
	if(msg.channelId == CONFIG["channel"]){
    console.log(msg.guildId);
    res = msg.content.match(exp)
    if(res){
      Promise.all([
        msg.react('👍'),
        msg.react('👎'),
        msg.react('🏳️')
      ]);
    }
	}
});
rest.put(
  Routes.applicationCommands(appID),
  { body: [new SlashCommandBuilder().setName('vote').setDescription('Compte les votes')].map(cmd=>cmd.toJSON()) }
  );

client.on('error', err => {
   console.warn(err);
});

client.login(token);
