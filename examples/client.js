var connect = require('..'),
		client = connect(),
		client_name = connect();

/**
 * Name
 **/

// Get Name
client_name.use(function(req, res, next) {
	res = 'My name is ' + req.path.split('/')[2];
	next(null, req, res);
});

// Capitalize Name
client_name.use(function(req, res, next) {
	res = res.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	next(null, req, res);
});

/**
 * Main
 **/

// Tidy request
client.use(function(req, res, next) {
	if(typeof req === 'string') {
		req = { path: req, method: 'get' };
	}
	next(null, req, res);
});

client.use('/name', client_name);

client('/name/luke', function(err, req, res) {
	console.log(res);
});