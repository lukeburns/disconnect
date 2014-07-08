var disconnect = require('..');

var client = disconnect();

client.use(require('./files'));
client.use(require('./git'));

client({ method: 'put', path: 'Readme.md', data: "Here are some examples." }, function call(err, req, res) {
	if(err) { throw new Error(err); }
	console.log(res.commit);
});