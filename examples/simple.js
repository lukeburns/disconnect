var disconnect = require('..');

var client = disconnect();
var name_handler = disconnect();

/**
 * Name Handler
 **/

// Format Name
name_handler.use(function(req, res, next) {
	res = 'My name is ' + req.path.split('/')[2]; // no reason client_name should expect name to be at [2] (should expect [1])
	next(null, req, res);
});

// Capitalize Name
name_handler.use(function(req, res, next) {
	res = res.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	next(null, req, res);
});

/**
 * Main Handler
 **/

// Tidy request
client.use(function(req, res, next) {
	if(typeof req === 'string') {
		req = { path: req, method: 'get' };
	}
	next(null, req, res);
});

/**
 * Call Main Handler
 **/

client.use('/name', name_handler);

client('/name/luke', function(err, req, res) {
	console.log(res);
});
