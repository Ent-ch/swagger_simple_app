var config = require('./dev'),
	mess = require('./messages');

config.auth = require('./auth');

for (var cMess in mess) {
	mess[cMess].m = {message: mess[cMess].m};
}
	
config.mess = mess;

config.applicationUrl = 'http://' + config.domain + ':' + config.port;
 
module.exports = config;