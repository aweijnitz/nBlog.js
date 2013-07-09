var config = require('./config/config.json');
var connect = require('connect');

if(!config) {
    console.error('Could not find ./config/config.json. Make sure it is in the config folder (relative to nBlog.js).');
    process.exit(1);
}

var dir = config.outputDir || __dirname;
var port = config.port || 8080;

var green  = '\033[32m';
var reset = '\033[0m';

if(process.argv.length >= 3)
	dir = process.argv[2];

if(process.argv.length >= 4)
	port = process.argv[3];

var app = connect()
  .use(connect.logger('default'))
  .use(connect.static(dir))
  .use(connect.directory(dir))
 .listen(port);

console.log('Serving from ' + green + dir + reset +' on port' + green + ' ' + port + reset);
