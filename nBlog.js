var compiler = require('./lib/compile.js');
var Mustache = require('mustache');
var fs = require("promised-io/fs");
var argv = require('optimist')
    .options('s', {
        alias : 'sourceDir',
        default : './test-data'
    })
    .options('d', {
      alias: 'destDir',
      default: './public/posts'
    })
    .usage('Process blog posts.\nUsage: $0 $1')
    .argv
;


// MOVE TO CONFIG (and cmd line args)
var ENCODING = 'utf-8';
var SOURCE_PATH = argv.sourceDir;
var DESTINATION_PATH = argv.destDir;

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

  if(!postsOnly) {
    // Render index.html
    //
    fs.readFile(BLOG_TEMPLATE, ENCODING).then(function(template) {
      var blogIndex = Mustache.render(template, blogSettings);
      fs.writeFile(BLOG_INDEX, blogIndex, ENCODING).then(function(result) {}, function(err) {
        console.error("COULD NOT WRITE BLOG INDEX " + BLOG_INDEX  + "Cause: " + err);
        process.exit(1);
      })
    },
    function(err) {
      console.error("COULD NOT READ BLOG TEMPLATE " + BLOG_TEMPLATE + "Cause: " + err);
      process.exit(1);
    });
  }

  // Compile posts and generate archive links
  compiler.compileDir(sourceDir, destDir);
}


if(runningAsScript) {
  console.info("Building blog");
  buildBlog(SOURCE_PATH, DESTINATION_PATH, false);
}


module.exports.buildBlog;
