var async = require('async');
var fs = require('fs');
var mkdirp = require('mkdirp');
var marked = require('marked');
var util = require('util');
var DS = require('./datasources.js');

// TODO: MOVE TO CONFIG
var MAX_CONCURRENCY = 10;
var ENCODING = 'utf-8';

var months = ['jan','feb','mar','apr','may','jun','jul','aug','sept','oct','nov','dec'];
var destinationPath = './public';

// Set output dir
var setDestinationPath = function(dir) {
  destinationPath = dir;
}

// Processesor for encued markdown posts
//
var compileJob = function(compileInfo, callback) {
  console.info('Compiling post: ' + compileInfo.fileName);
  var date = new Date(compileInfo.date);
  var path = destinationPath + '/' + date.getFullYear() + '/' 
            + months[date.getMonth()];
  compileBlogPost(path, compileInfo.fileName, compileInfo.markdown);
  callback();
}

// Compile and write file
//
var compileBlogPost = function(destinationPath, fileName, blogPost) {
  mkDirs(destinationPath, function() { // make sure directory exists (or create)
    var file = destinationPath + '/' + fileName;
    util.debug("WRITING "+ file)
    fs.writeFile(file, marked(blogPost), ENCODING, function (err) {
      if (err) throw err;
    });
  });
}

// Make all dirs in path ("mkdir -p")
//
var mkDirs = function(path, callback) {
  mkdirp(path, callback);
}

// Extract date and title from post, then encue for compilation
//
var encuePost = function(blogPost) {
  var postMeta = getDateAndTitle(blogPost);
  compilerQueue.push({
    "fileName": postMeta.fileName + '.html',
    "date": postMeta.date,
    "markdown": blogPost
  });
}


var getDateAndTitle = function(markdownData) {
  var lines = markdownData.toString(ENCODING).split("\n");
  var dateStr = lines[0]; // By convention, date will be in the first line
  var title = lines[1]; // By convention, blog post title will be second

  if(dateStr == null || dateStr.length <= 0) {
    var date = new Date();
    dateStr = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
  }
    
  if(title == null || title.length <= 0)
    title = "untitled";

  title = (title.replace(/\s/g, "-")).replace(/#*/g,""); // handle whitespace and (some) markdown
  return {
    "fileName": encodeURIComponent(title),
    "date": dateStr
  }
}

// Queue for all compile jobs
//
var compilerQueue = async.queue(compileJob, MAX_CONCURRENCY);


var compileDir = function(sourceDir, destDir) {
  setDestinationPath(destDir);
  DS.processDir(sourceDir, encuePost);  
}

var testCompile = function() {
  DS.processDummy(encuePost)
}

var Compiler = module.exports = {
  compileDir: compileDir,
  testCompile: testCompile
};
