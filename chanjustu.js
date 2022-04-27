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
  if(journeEcoule < convHeureMillis(CONFIG['fermeture']['horaire']) && 
     journeEcoule > convHeureMillis(CONFIG['ouverture']['horaire']) ){
    defPermChansV(CONFIG["channels"],CONFIG["role"],CONFIG["ouverture"]["droits"]);  
  }else{
    defPermChansV(CONFIG["channels"],CONFIG["role"],CONFIG["fermeture"]["droits"]);
  }
  resoleur();
}

function resoleur() {
  let journeEcoule = (Date.now()+ decalage()  ) % 86400000
  console.log("Maintenant",journeEcoule);
  console.log("ouve",convHeureMillis(CONFIG['ouverture']['horaire']));
  console.log("ferm",convHeureMillis(CONFIG['fermeture']['horaire']));

  if(journeEcoule < convHeureMillis(CONFIG['fermeture']['horaire']) && 
     journeEcoule < convHeureMillis(CONFIG['ouverture']['horaire']) ){
    setTimeout(devoiler,convHeureMillis(CONFIG['ouverture']['horaire'])-journeEcoule);
    setTimeout(cacher  ,convHeureMillis(CONFIG['fermeture']['horaire'])-journeEcoule);
    console.log("Avenir ",new Date(decalage()+ Date.now()+convHeureMillis(CONFIG['ouverture']['horaire'])-journeEcoule ));
    console.log("Avenir ",new Date(decalage()+ Date.now()+convHeureMillis(CONFIG['fermeture']['horaire'])-journeEcoule));
  }else if(journeEcoule < convHeureMillis(CONFIG['fermeture']['horaire']) && 
           journeEcoule > convHeureMillis(CONFIG['ouverture']['horaire']) ){
    setTimeout(devoiler,86400000 + convHeureMillis(CONFIG['ouverture']['horaire'])-journeEcoule);
    setTimeout(cacher  ,           convHeureMillis(CONFIG['fermeture']['horaire'])-journeEcoule);
    console.log("Avenir ",new Date(decalage()+ Date.now() +86400000 + convHeureMillis(CONFIG['ouverture']['horaire'])-journeEcoule ));
    console.log("Passé ",new Date(decalage()+ Date.now() +convHeureMillis(CONFIG['fermeture']['horaire'])-journeEcoule));
  }else if(journeEcoule > convHeureMillis(CONFIG['fermeture']['horaire']) && 
           journeEcoule > convHeureMillis(CONFIG['ouverture']['horaire'])) {
    setTimeout(devoiler,86400000 + convHeureMillis(CONFIG['ouverture']['horaire'])-journeEcoule);
    setTimeout(cacher  ,86400000 + convHeureMillis(CONFIG['fermeture']['horaire'])-journeEcoule);
    
    console.log("Passé ",new Date(decalage()+ Date.now() +86400000 + convHeureMillis(CONFIG['ouverture']['horaire'])-journeEcoule ));
    console.log("Passé ",new Date(decalage()+ Date.now() +86400000 + convHeureMillis(CONFIG['fermeture']['horaire'])-journeEcoule));
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
  defPermChans(CONFIG["channels"],CONFIG["role"],'21990232555510' );
  setInterval(
    defPermChans,
    86400000,
    CONFIG["channels"],CONFIG["role"],'21990232555510' );
}

function devoiler() {
  defPermChans(CONFIG["channels"],CONFIG["role"],'0' ); 
  setInterval(
    defPermChans,
    86400000,
    CONFIG["channels"],CONFIG["role"],'0' );
}

function defPermChansV(chans,role,perm) {
  return acqPermChans(chans)
    .then(chansPerms =>{
      chans.forEach(chan => {
        chansPerms[chan].forEach(ChanPerm => {
          if(ChanPerm["id"] === role){
            if(perm != ChanPerm["deny"]){
              console.log(chan);
              return defPermChan(chan,role,perm);
            }
          }
        });
      })
    });
}

function defPermChans(chans,role,perm) {
   let listePromesses = [];
  chans.forEach(chan => {
    listePromesses.push(defPermChan(chan,role,perm));
  });
  return Promise.all(listePromesses);  
}

function defPermChan(chan,role,perm) {
  console.log(new Date(),"[permChans] -> ",chan,role,perm);
    return rest.patch(
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
}

function acqPermChans(chans) {
  let reps = []
  chans.forEach(chan => {
    reps.push(rest.get(Routes.channel(chan)));
      //.then(rep => {return rep["permission_overwrites"]}));
  });
  return Promise.all(reps).then(valeurs =>{
    let res = {}
    valeurs.forEach(val => {
      res[val["id"]] = val["permission_overwrites"]
    })
    return res;
  });
}
// console.log(decalage());
init();
// acqPermChans(CONFIG["channels"]).then(console.log)