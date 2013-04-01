var compiler = require('./lib/compile.js');
var Mustache = require('mustache');
var fs = require("promised-io/fs");


// MOVE TO CONFIG (and cmd line args)
var ENCODING = 'utf-8';
var SOURCE_PATH = "./test-data";
var DESTINATION_PATH = "./public/posts";

var BLOG_TEMPLATE = './lib/templates/index.mustache';
var BLOG_INDEX = './public/index.html';
var blogSettings = {
  blogName: "Socket Rocket",
  author: "Anders Weijnitz",
  topRight: "Ander's blog",
  aboutURL: "http://www.linkedin.com/in/andersweijnitz",
  twitterURL: "https://twitter.com/aweijnitz"
};

 
fs.readFile(BLOG_TEMPLATE, ENCODING).then(function(template) {
  var blogIndex = Mustache.render(template, blogSettings);
  fs.writeFile(BLOG_INDEX, blogIndex, ENCODING).then(function(result) {}, function(err) {
    console.error("COULD NOT WRITE BLOG INDEX " + BLOG_INDEX  + "Cause: \n" + err);
  })
},
function(err) {
  console.error("COULD NOT READ BLOG TEMPLATE " + BLOG_TEMPLATE + "Cause: \n" + err);

});


// Compile posts and generate archive links
compiler.compileDir(SOURCE_PATH, DESTINATION_PATH);
