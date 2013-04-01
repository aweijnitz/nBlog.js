// Datasource factory
//
var async = require('async');
var fs = require("promised-io/fs"); //require('fs');
var promise = require("promised-io/promise");
var mkdirp = require('mkdirp');
var util = require('util');
//var logger = require('./logger.js');


// TODO: Get from config
var ENCODING = 'utf-8';
var matchMd = /\.md/gi; 


var readAndCompileFile = function(fileName, sourceDir, compiler) {
  // logger.info("datasources.readAndCompileFile: reading " + fileName);
  if(fileName.match(matchMd)) {
    // logger.info("Queing " + fileName);
    return fs.readFile(sourceDir + '/' + fileName, ENCODING).then(function(data) {
      compiler(data);
    },
    function(err) {
      // logger.error("COULD NOT READ SOURCE POST: " + fileName + "Cause:\n"+err);
    });
  }
} 

var storePost = function(destinationPath, fileName, data, callback) {
  var destFile = destinationPath + '/' + fileName;
  mkDirs(destinationPath, function() { // make sure directory exists (or create)
    // util.debug("WRITING "+ destFile)
    fs.writeFile(destFile, data, ENCODING).then(function(result) {
      if(callback)
        callback(null, destFile);
    },
    function(err) {
      // logger.error("COULDN'T WRITE POST " + fileName + ' Cause:\n ' + err);
      if(callback)
        callback(err, destFile);
    });
  });  
}


// Make all dirs in path ("mkdir -p")
//
var mkDirs = function(path, callback) {
  mkdirp(path, callback);
}


var processFiles = function(sourceDir, fileList, compiler) {
  var promises = [];
  fileList.forEach(function(file) {
    promises.push(readAndCompileFile(file, sourceDir, compiler));
  });
  return promises;
}

// Datasources receive parameters and a callback to process 
// blog posts in a repository. 
var DS = {
  processDir: function(dir, compiler) {
    //var deferred = promise.defer();
    var filePromises = [];
    fs.readdir(dir).then(
      function(fileList) {
        // logger.info("datasources.processDir: files to process: " + fileList.length);
        filePromises = processFiles(dir, fileList, compiler);
      },
      function(err) {
        // logger.err("datasources.processDir ERROR\n" + err);
      });

    //// logger.info(filePromises);
    return promise.all(filePromises); // Make a promise
  },
  processGitRepo: function(repo, path, compiler) {
    util.debug("Git datasource not yet implemented.");
    return null;
  },
  storePost: storePost
};

module.exports = DS;

