// Datasource factory
//
var async = require('async');
var fs = require('fs');
var util = require('util');

var matchMd = /\.md/gi; 

// TODO: Get from config
var ENCODING = 'utf-8';


var readAndCompileFile = function(fileName, sourceDir, compilerCallback) {
  var cb = function(err, blogPost) {
    if (err) 
      throw err;
    compilerCallback(blogPost);
  }
  if(fileName.match(matchMd)) {
    console.log("Queing " + fileName);
    fs.readFile(sourceDir + '/' + fileName, ENCODING, cb);
  }
}

var processFiles = function(err, sourceDir, fileList, compilerCallback) {
  if(err) {
    console.error(err);
    throw err;
  }
  fileList.forEach(function(file) {
    readAndCompileFile(file, sourceDir, compilerCallback);
  });
}

// Datasources receive parameters and a callback to process 
// blog posts in a repository. 
var DS = {
  processDir: function(dir, compilerCallback) {
    fs.readdir(dir, function(err, fileList) {
      processFiles(err, dir, fileList, compilerCallback);
    });
  },
  // For test purposes
  processDummy: function(compilerCallback) {
    var posts = ["2013-04-23\n#Blog Post Title\nSome dummy text.",
                 "2013-05-14\n#Another Blog Post Title\nSome more dummy text."];
    posts.forEach(compilerCallback);
  },
  processGitRepo: function(repo, path, compilerCallback) {
    util.debug("Git datasource not yet implemented.");
    return null;
  }  
};


module.exports = DS;