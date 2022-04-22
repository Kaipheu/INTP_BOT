const fs = require('fs');
const YAML = require('yaml');
const { token } = require('./config.json');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

const config_file = fs.readFileSync('bot.yml', 'utf8')

let CONFIG = YAML.parse(config_file).insomnie;

const rest = new REST({ version: '10' }).setToken(token);


function init() {
  journeEcoule = (Date.now()+ (new Date().getUTCHours() - new Date().getHours())  )% 86400000
  if(journeEcoule > CONFIG['horaire']['fermeture'] ){
      permChans(CONFIG["channels"],CONFIG["role"],'21990232555510' );      
      setTimeout(devoiler,(CONFIG['horaire']['ouverture']-journeEcoule));
    }else{      
      permChans(CONFIG["channels"],CONFIG["role"],'0' );      
      setTimeout(cacher,(CONFIG['horaire']['fermeture']-journeEcoule));
  }
  
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
init();