var async = require('async');
var fs = require('fs');
var mkdirp = require('mkdirp');
var marked = require('marked');
var Mustache = require('mustache');
var util = require('util');
var DS = require('./datasources.js');
var helpers = require('./helpers.js');

// TODO: MOVE TO CONFIG
var MAX_CONCURRENCY = 10;
var ENCODING = 'utf-8';

// Template files
var archiveTemplateFile = './lib/templates/archive_links.mustache';

var months = ['jan','feb','mar','apr','may','jun','jul','aug','sept','oct','nov','dec'];
var destinationPath = './public/posts'; // Default
var archive = [];

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
  var htmlPost = compileBlogPost(compileInfo.markdown);
  storePost(path, compileInfo.fileName, 
            htmlPost,
            function(err, result) {
              if(err) 
                throw err;
              archive.push({
                title: compileInfo.title,
                date: compileInfo.date,
                path: path+'/'+compileInfo.fileName
              })
              callback();
            });
}

var storePost = function(destinationPath, fileName, data, callback) {
  var destFile = destinationPath + '/' + fileName;
  mkDirs(destinationPath, function() { // make sure directory exists (or create)
    util.debug("WRITING "+ destFile)
    fs.writeFile(destFile, data, ENCODING, function (err) {
      callback(err, destFile);
    });
  });  
}

// Compile markdown file to html. Return html.
// Currently only a marked wrapper. Extra processing of the post will go here.
var compileBlogPost = function(blogPost) {
  return marked(blogPost); 
}

// Make all dirs in path ("mkdir -p")
//
var mkDirs = function(path, callback) {
  mkdirp(path, callback);
}

// Extract date and title from post, then encue for compilation
//
var encuePost = function(blogPost) {
  var postMeta = helpers.getDateAndTitle(blogPost, ENCODING);
  compilerQueue.push({
    "fileName": postMeta.fileName + '.html',
    "date": postMeta.date,
    "markdown": blogPost
  });
}


var processArchive = function() {
  helpers.sortArrayOnProp(archive, "date", false);  
  var view = {
    archive: archive
  };
  console.log(view);
  var applyTemplate = function(err, template) {
    if(err) throw err;
    console.log(Mustache.render(template, view));  
  };

  // {{#archive}}* {{title}}{{/archive}}
  //fs.readFile(archiveTemplateFile, applyTemplate);
  applyTemplate(false, "{{#archive}}* {{title}}{{/archive}}")

}

// Queue for all compile jobs
//
var compilerQueue = async.queue(compileJob, MAX_CONCURRENCY);


var compileDir = function(sourceDir, destDir) {
  setDestinationPath(destDir);
  
  // Process posts
  archive = [];
  DS.processDir(sourceDir, encuePost);
  processArchive();  
}

var testCompile = function() {
  archive = [];
  DS.processDummy(encuePost);
  processArchive();
}

module.exports = {
  compileBlogPost: compileBlogPost,
  compileDir: compileDir,
  testCompile: testCompile
};
