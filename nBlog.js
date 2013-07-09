var config = require('./config/config.json');
var blogSettings = require('./config/blogSettings.json');

var Mustache = require('mustache');           // Template engine 
var bunyan =require('bunyan');                // Logging service
var fs = require("promised-io/fs");           
var promise = require("promised-io/promise");

var compiler = require('./lib/compile.js');

if(!config) {
    console.error('Could not find ./config/config.json. Make sure it is in the config folder (relative to nBlog.js).');
    process.exit(1);
}

if(!blogSettings) {
    console.error('Could not find blogSettings.json. Make sure it is in the config folder (relative to nBlog.js).');
    process.exit(1);
}


var logger = bunyan.createLogger({
    name: 'nBlog',
    streams: [{
        type: 'rotating-file',
        path: config.logFile.name || "./logs/nBlog.log",
        period: config.logFile.logRotationPeriod || "1m",
        count: 12
    }]
});


var ENCODING = config.encoding || 'utf-8';
var SOURCE_PATH = config.inputDir;
var DESTINATION_PATH = config.outputDir;

var BLOG_TEMPLATE = config.blogTemplatesDir || './lib/templates/index.mustache';
var BLOG_INDEX = config.blogIndexFile || './public/index.html';

var runningAsScript = require.main === module;

var buildBlog = function(sourceDir, destDir, postsOnly) { 
  var indexBuilt = promise.defer();
  if(!postsOnly) {
    // Render index.html
    //
    fs.readFile(BLOG_TEMPLATE, ENCODING).then(function(template) {
        var blogIndex = Mustache.render(template, blogSettings);
        fs.writeFile(BLOG_INDEX, blogIndex, ENCODING).then(function(result) {
          indexBuilt.resolve(true);
      }, function(err) {
        logger.fatal({"error": err}, "COULD NOT WRITE BLOG INDEX " + BLOG_INDEX  + "Cause: " + err);
        indexBuilt.reject(err);
        if(runningAsScript)
          process.exit(1);
      })
    },
    function(err) {
      logger.fatal({"error": err}, "COULD NOT READ BLOG TEMPLATE " + BLOG_TEMPLATE + "Cause: " + err);
      indexBuilt.reject(err);
      if(runningAsScript)
        process.exit(1);
    });
  }

  // Compile posts and generate archive links
  var promisePosts = compiler.compileDir(sourceDir, destDir+'/posts');
  return promise.all([indexBuilt, promisePosts]);
}


if(runningAsScript) {
  logger.info("RUNNING AS SCRIPT");
  var argv = require('optimist');
  argv.options('v', {
    alias : 'verbose',
    default : false
  })
  .options('a', {
    alias: 'all',
    default: false
  })
  .demand(2)
  .usage("Process blog posts.\nUsage: node nBlog $0 $1 <markdownSrcDir> <destDir>\n"+
         "example: node nBlog.js -a ./test-data ./public")
  .argv;
  buildBlog(argv.argv._[0], argv.argv._[1], argv.all);
}


module.exports.buildBlog = buildBlog;
