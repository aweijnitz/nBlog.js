var fs = require("promised-io/fs");
var promise = require("promised-io/promise");
var Mustache = require('mustache');


// Generates test posts

var fileNames = [];
var postTemplate = "{{date}}\n#{{title}}\nSome text.\n";
var currYear = 2013;
var currMonth = 1;
var currDay = 1;


var nextDate = function() {
  currDay++;
  if(currDay > 28) {
    currDay = 1;
    currMonth++;
    if(currMonth > 12) {
      currYear++;
      currMonth = 1;
    }
  }
  return new Date(currYear + '-' + currMonth + '-' + currDay);
}

var formatDate = function(date) {
  var month = date.getMonth();
  var day = date.getDate();
  dateStr = date.getFullYear() + '-' 
    + ((month+1) < 10 ? ("0"+(month+1)):(month+1)) 
    + '-' + (day < 10 ? ("0"+ day ): day );
  return dateStr;  
}

module.exports.generate = function(targetDir, nrPosts) {
  fileNames = [];
  var template = Mustache.compile(postTemplate);
  fs.makeTree(targetDir);
  for(i = 0; i < nrPosts; i++) {
    var fileName = targetDir + '/' + 'post' + i + '.md';
    console.log("FILE "+fileName);
    var view = {
      title: "Blog post " + i,
      date: formatDate(nextDate())
    };
    var post = template(view);
    //console.log(post);
    fs.writeFile(fileName, post, 'utf8').then(function(result) {
      //console.log("Wrote "+fileName);
      fileNames.push(fileName);
    },
    function(err) {
      console.error("COULDN'T WRITE POST " + fileName + ' Cause:\n ' + err);
    });
  }
}

module.exports.cleanup = function(targetDir) {
  fs.rmdir(targetDir).then(function(result) { 
    console.info("Removing "+targetDir);
  },
  function(err) {
    console.error("ERROR REMOVING "+targetDir);
    console.error(err);
  });
  fileNames.forEach(function(item) {
    fs.unlink(item).then(function(result) {
      console.log("Removed: "+item);
    });
  });
}