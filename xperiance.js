const fs = require('fs');
const YAML = require('yaml');

const https = require('https');
const {EventEmitter, once} = require('events');
const { guild_id } = require('./config.json');
class responseEmitter extends EventEmitter {}

const config_file = fs.readFileSync('bot.yml', 'utf8')
const CONFIG = YAML.parse(config_file).propositions;

const options = {
  hostname: 'mee6.xyz',
  port: 443,
  path: '/api/plugins/levels/leaderboard/' + CONFIG["serveur"],
  method: 'GET'
};


exp = async function() {
	let donnees = "";
	let response = null;
	const map = new Map();
	const resEmitter = new responseEmitter();
	const req = https.request(options,(res)=>{
		resEmitter.emit('response',res);
	});
	req.end();
	res = await once(resEmitter, 'response');
	res[0].on('data',(chunk)=>{
		donnees += chunk;
	});
	await once(res[0],'end');
	donnees = JSON.parse(donnees)["players"];
	donnees.forEach(ele => {
		map.set(ele["id"],ele);
	});
	return map;
}

module.exports = exp;