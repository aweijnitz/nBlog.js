var async = require('async');
var fs = require("promised-io/fs"); //require('fs');
var promise = require("promised-io/promise");
var marked = require('marked');
var Mustache = require('mustache');
var util = require('util');
var logger = require('./logger.js');
var DS = require('./datasources.js');
var helpers = require('./helpers.js');

// TODO: MOVE TO CONFIG
var MAX_CONCURRENCY = 32;
var ENCODING = 'utf-8';

// Template files
var archiveTemplateFile = './lib/templates/archive_links.mustache';

var months = ['jan','feb','mar','apr','may','jun','jul','aug','sept','oct','nov','dec'];
var destinationPath = null;
var archive = [];
var deferredBlogCompletion = null;


// Set output dir
var setDestinationPath = function(dir) {
  destinationPath = dir;
}

// Processesor for encued markdown posts
//
var compileJob = function(compileInfo, callback) {
//  console.info('Compiling post: ' + compileInfo.fileName);
  var date = new Date(compileInfo.date);
  var datePath = date.getFullYear() + '/' + months[date.getMonth()];
  var path = destinationPath + '/' + datePath;
  var htmlPost = compileBlogPost(compileInfo.markdown);
  DS.storePost(path, compileInfo.fileName, htmlPost,
    function(err, result) {
      if(err) 
        throw err;
      addArchiveEntry({
        title: compileInfo.title,
        date: compileInfo.date,
        file: 'posts/'+datePath+'/'+compileInfo.fileName
      });
      callback();
    });
}

var addArchiveEntry = function(entry) {
  archive.push(entry);
}

// Compile markdown file to html. Return html.
// Currently only a marked wrapper. Extra processing of the post will go here.
var compileBlogPost = function(blogPost) {
  return marked(blogPost); 
}


// Extract date and title from post, then encue for compilation
//
var encuePost = function(blogPost) {
  var postMeta = helpers.getDateAndTitle(blogPost, ENCODING);
  compilerQueue.push({
    "fileName": postMeta.fileName + '.html',
    "date": postMeta.date,
    "markdown": blogPost,
    "title": postMeta.title
  });
}


var processArchive = function() {
  helpers.sortArrayOnProp(archive, "date", false);  
  var view = {
    archive: archive
  };

  fs.readFile(archiveTemplateFile, ENCODING).then(function(result) {
    var template = Mustache.compile(result);
    var output = template(view);
    //console.info(output);
    //console.info(JSON.stringify(archive));
    DS.storePost(destinationPath, 'archive_links.html', output, null);
    DS.storePost(destinationPath, 'archive_links.json', JSON.stringify(archive), null);
    deferredBlogCompletion.resolve(archive.length);
  },
  function(err) {
    console.error("COULD NOT READ ARCHIVE TEMPLATE " + archiveTemplateFile + "Cause: \n" + err);
    deferredBlogCompletion.reject(err);
  });
}

// Queue for all compile jobs
//
var compilerQueue = async.queue(compileJob, MAX_CONCURRENCY);

compilerQueue.drain = function() {
//  console.log('____ ALL posts have been processed');
  processArchive();
}

var resetArchive = function() {
  archive = [];  
}

var compileDir = function(sourceDir, destDir) {
  deferredBlogCompletion = promise.defer();
  setDestinationPath(destDir);
  // Process posts
  resetArchive();
  DS.processDir(sourceDir, encuePost);
  return deferredBlogCompletion.promise;

}

module.exports = {
  compileBlogPost: compileBlogPost,
  compileDir: compileDir,
};
