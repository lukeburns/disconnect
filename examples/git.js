var disconnect = require('..'),
		fs = require('fs'),
		exec = require('child_process').exec,
		git_handler = disconnect();

// Get git paths
git_handler.use(function(req, res, next) {
	fs.exists(req.path, function(exists) {
		if(exists) {
			fs.stat(req.path, function(err, stats) {
				if(stats.isFile()) {
					var parts = req.path.split('/'),
							file = parts.pop(),
							path = parts.join('/');
					req.git_repo = path;
					req.git_file = file;
				} else {
					req.git_repo = req.path;
				}
				next();
			});
		}
	});
});

// Ensure git repo exists
git_handler.use(function(req, res, next) {
	fs.exists(require('path').join(req.git_repo,'.git'), function(exists) {
		if(!exists) {
			exec('git init', { cwd: req.git_repo }, function(err, stdout, stderr) {
				if(!stderr && !err) {
					next();
				} else {
					next(new Error(JSON.stringify({stderr: stderr, err: err})));
				}
			});
		} else {
			next();
		}
	});
});

// Handle requests
git_handler.use(function(req, res, next) {
	if(req.method === 'get') {
		exec('git log -- ' + req.git_file, { cwd: req.git_repo }, function(err, stdout, stderr) {
			if(!stderr && !err) {
				res = { data: res, log: stdout }
				next(null, req, res);
			} else {
				next(new Error(JSON.stringify({stderr: stderr, err: err})))
			}
		});
	} else if(req.method === 'put' || req.method === 'append') {

		// STAGE
		exec('git add ' + req.git_file, { cwd: req.git_repo }, function(err, stdout, stderr) {
			if(!stderr && !err) {

				// COMMIT
				exec('git commit -m "' + req.git_file + ' ' + Date.now() + '"', { cwd: req.git_repo }, function(err, stdout, stderr) {
					if(!stderr && !err) {
						res = { commit: stdout };
						next(null, req, res);
					} else {
						next(new Error(JSON.stringify({stderr: stderr, err: err})))
					}
				});
			} else {
				next(new Error(JSON.stringify({stderr: stderr, err: err})))
			}
		});
	}
});

module.exports = git_handler;