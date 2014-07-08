var disconnect = require('..'),
		fs = require('fs'),
		file_handler = disconnect();

// Tidy requests
file_handler.use(function(req, res, next) {
	if(typeof req === 'string') {
		req = { path: req, method: 'get' };
	}
	next(null, req, res);
});

// // Purge requests
// file_handler.use('..', function(req, res, next){
// 	if(req.method == 'put') {
// 		next(new Error('Cannot write outside of root directory.'))
// 	} else {
// 		next();
// 	}
// });

// Handle requests
file_handler.use(function(req, res, next) {
	if(req.method === 'get') {
		fs.readFile(req.path, 'utf8', function(err, data) {
			next(err, req, data);
		});
	} else if(req.method === 'put') {
		fs.writeFile(req.path, req.data, function(err) {
			next(err);
		});
	} else if(req.method === 'append') {
		fs.appendFile(req.path, req.data, function(err) {
			next(err);
		});
	}
});

module.exports = file_handler;