// Datasource factory
//
var async = require('async');
var fs = require('fs');
var util = require('util');

// Define factory methods for datasources
// A datasource returns a function that returns an array of post data (markdown)
// to be compiled.
var DS = {
  directory: function(dir, compilerCallback) {
    util.debug("File datasource not yet implemented.");
    return null;
  },
  dummy: function(compilerCallback) {
    return new function() {
      return ["2013-04-14\n#Blog Post Title\nSome dummy text."];
    }
  },
  git: function(repo, path, compilerCallback) {
    util.debug("Git datasource not yet implemented.");
    return null;
  }  
};


module.exports = DS;