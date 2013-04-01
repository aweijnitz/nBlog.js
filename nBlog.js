var Mustache = require('mustache');
var fs = require("promised-io/fs");
var promise = require("promised-io/promise");
var logger = require('./lib/logger.js');
var compiler = require('./lib/compile.js');

// MOVE TO CONFIG (and cmd line args)
var ENCODING = 'utf-8';
var SOURCE_PATH = null;
var DESTINATION_PATH = null;

var BLOG_TEMPLATE = './lib/templates/index.mustache';
var BLOG_INDEX = './public/index.html';
var blogSettings = {
  blogName: "Socket Rocket",
  author: "Anders Weijnitz",
  topRight: "Anders's blog",
  aboutURL: "http://www.linkedin.com/in/andersweijnitz",
  twitterURL: "https://twitter.com/aweijnitz"
};

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
        // logger.error("COULD NOT WRITE BLOG INDEX " + BLOG_INDEX  + "Cause: " + err);
        indexBuilt.reject(err);
        if(runningAsScript)
          process.exit(1);
      })
    },
    function(err) {
      // logger.error("COULD NOT READ BLOG TEMPLATE " + BLOG_TEMPLATE + "Cause: " + err);
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
  // logger.info("RUNNING AS SCRIPT");
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
