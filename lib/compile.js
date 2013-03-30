var async = require('async');
var fs = require('fs');
var mkdirp = require('mkdirp');
var marked = require('marked');
var util = require('util');

// TODO: MOVE TO CONFIG
var MAX_CONCURRENCY = 10;
var SOURCE_PATH = "./posts";
var DESTINATION_PATH = "./public";
var ENCODING = 'utf-8';

var months = ['jan','feb','mar','apr','may','jun','jul','aug','sept','oct','nov','dec'];
var matchMd = /\.md/gi; 

var compilerQueue = async.queue(function (task, callback) {
  console.info('Compiling: ' + task.fileName);
  var date = new Date(task.date);
  var path = DESTINATION_PATH + '/' + date.getFullYear() + '/' 
            + months[date.getMonth()];
  mkDirs(path, function() { // make sure directory exists (or create)
    var file = path + '/' + task.fileName;
    util.debug("WRITING "+ file);
    fs.writeFile(file, marked(task.markdown), ENCODING, function (err) {
      if (err) throw err;
    });
  });

  callback();
}, MAX_CONCURRENCY);


// Make all dirs in path
var mkDirs = function(path, callback) {
  mkdirp(path, callback);
}


// TODO: Abstract to data sources (FS, GIT, DB, ...)
fs.readdir(SOURCE_PATH, function(err, files) {
  if(err) {
    console.error(err);
    throw err;
  }
  // util.debug(files);
  files.forEach(function(fileName) {
    if(fileName.match(matchMd)) {
      console.log("Queing "+fileName);
      fs.readFile(SOURCE_PATH+'/'+fileName, ENCODING, function (err, data) {
        if (err) 
          throw err;

        var postMeta = getDateAndTitle(data);
        compilerQueue.push({
          "fileName": postMeta.fileName + '.html',
          "date": postMeta.date,
          "markdown": data
        });
      });
    }
  });
});

var getDateAndTitle = function(markdownData) {
  var lines = markdownData.toString(ENCODING).split("\n");
  var dateStr = lines[0]; // By convention
  var title = lines[1]; // By convention

  if(dateStr == null || dateStr.length <= 0) {
    var date = new Date();
    dateStr = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
  }
    
  if(title == null || title.length <= 0)
    title = "untitled";

  title = (title.replace(/\s/g, "-")).replace(/#*/g,""); // handle whitespace and markdown
  return {
    "fileName": encodeURIComponent(title),
    "date": dateStr
  }
}


