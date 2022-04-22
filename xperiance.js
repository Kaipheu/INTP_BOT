const https = require('https');
const {EventEmitter, once} = require('events');
const { guild_id } = require('./config.json');
class responseEmitter extends EventEmitter {}

const options = {
  hostname: 'mee6.xyz',
  port: 443,
  path: '/api/plugins/levels/leaderboard/' + guild_id,
  method: 'GET'
};


exp = async function() {
	let donnees = "";
	let response = null;
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
	return JSON.parse(donnees);
}

module.exports = exp;