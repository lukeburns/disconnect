# Disconnect: Connect middleware without the server
[![Gitter chat](https://badges.gitter.im/lukeburns/disconnect.png)](https://gitter.im/lukeburns/disconnect)

Connect middleware disconnected from http. Middleware can write to req and res.

```js
var disconnect = require('disconnect');
var client = disconnect();

// Middleware
client.use(require('./files')); // read and write files
client.use(require('./git')); // commit writes + retrieve logs on reads

// Write
client({ method: 'put', path: 'Readme.md', data: "Here are some examples." }, function call(err, req, res) {
	console.log(res.commit); // stdout from commit
});

// Read
client('Readme.md', function(err, req, res) {
	console.log(res.data); // file contents
	console.log(res.log); // git log for file
});
```

## License

View the [LICENSE](https://github.com/senchalabs/connect/blob/master/LICENSE) file.
