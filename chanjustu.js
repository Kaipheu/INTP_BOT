const fs = require('fs');
const YAML = require('yaml');
const { token } = require('./config.json');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');


const config_file = fs.readFileSync('bot.yml', 'utf8')

const CONFIG = YAML.parse(config_file).insomnie;
const rest = new REST({ version: '10' }).setToken(token);


function init() {
  let journeEcoule = (Date.now()+ decalage()  ) % 86400000
  if(journeEcoule < convHeureMillis(CONFIG['horaire']['fermeture']) && 
     journeEcoule > convHeureMillis(CONFIG['horaire']['ouverture']) ){
      permChans(CONFIG["channels"],CONFIG["role"],'0' );
  }else{     
      permChans(CONFIG["channels"],CONFIG["role"],'21990232555510' );
  }
  resoleur();
}

function resoleur() {
  let journeEcoule = (Date.now()+ decalage()  ) % 86400000
  console.log("Maintenant",journeEcoule);
  console.log("ouve",convHeureMillis(CONFIG['horaire']['ouverture']));
  console.log("ferm",convHeureMillis(CONFIG['horaire']['fermeture']));

  if(journeEcoule < convHeureMillis(CONFIG['horaire']['fermeture']) && 
     journeEcoule < convHeureMillis(CONFIG['horaire']['ouverture']) ){
    setTimeout(devoiler,convHeureMillis(CONFIG['horaire']['ouverture'])-journeEcoule);
    setTimeout(cacher  ,convHeureMillis(CONFIG['horaire']['fermeture'])-journeEcoule);
    console.log("Avenir ",new Date(decalage()+ Date.now()+convHeureMillis(CONFIG['horaire']['ouverture'])-journeEcoule ));
    console.log("Avenir ",new Date(decalage()+ Date.now()+convHeureMillis(CONFIG['horaire']['fermeture'])-journeEcoule));
  }else if(journeEcoule < convHeureMillis(CONFIG['horaire']['fermeture']) && 
           journeEcoule > convHeureMillis(CONFIG['horaire']['ouverture']) ){
    setTimeout(devoiler,86400000 + convHeureMillis(CONFIG['horaire']['ouverture'])-journeEcoule);
    setTimeout(cacher  ,           convHeureMillis(CONFIG['horaire']['fermeture'])-journeEcoule);
    console.log("Avenir ",new Date(decalage()+ Date.now() +86400000 + convHeureMillis(CONFIG['horaire']['ouverture'])-journeEcoule ));
    console.log("Passé ",new Date(decalage()+ Date.now() +convHeureMillis(CONFIG['horaire']['fermeture'])-journeEcoule));
  }else if(journeEcoule > convHeureMillis(CONFIG['horaire']['fermeture']) && 
           journeEcoule > convHeureMillis(CONFIG['horaire']['ouverture'])) {
    setTimeout(devoiler,86400000 + convHeureMillis(CONFIG['horaire']['ouverture'])-journeEcoule);
    setTimeout(cacher  ,86400000 + convHeureMillis(CONFIG['horaire']['fermeture'])-journeEcoule);
    
    console.log("Passé ",new Date(decalage()+ Date.now() +86400000 + convHeureMillis(CONFIG['horaire']['ouverture'])-journeEcoule ));
    console.log("Passé ",new Date(decalage()+ Date.now() +86400000 + convHeureMillis(CONFIG['horaire']['fermeture'])-journeEcoule));
  }

}

function decalage(){
  return - (new Date).getTimezoneOffset() * 60000;
}
function convHeureMillis(heures) {
  let heuresListe = heures.split('h');
  return (parseInt(heuresListe[0])* 3600 + parseInt(heuresListe[1]) * 60)*1000;
}

function cacher() {
  permChans(CONFIG["channels"],CONFIG["role"],'21990232555510' );
  setInterval(
    permChans,
    86400000,
    CONFIG["channels"],CONFIG["role"],'21990232555510' );
}

function devoiler() {
  permChans(CONFIG["channels"],CONFIG["role"],'0' ); 
  setInterval(
    permChans,
    86400000,
    CONFIG["channels"],CONFIG["role"],'0' );
}

function permChans(chans,role,perm) {
  console.log(new Date(),"[permChans] -> ",chans,role,perm);
  chans.forEach(chan => {
    rest.patch(
      Routes.channel(chan),
      {
        body:{
          permission_overwrites: [
            { 
              id: role, 
              type: 0, 
              allow: '0', 
              deny: perm
            }
          ]
        }
      }
    );
  });  
}

// console.log(decalage());
init();