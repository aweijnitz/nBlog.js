var compiler = require('./lib/compile.js');

var SOURCE_PATH = "./posts";
var DESTINATION_PATH = "./public/posts";

// compiler.testCompile();
compiler.compileDir(SOURCE_PATH, DESTINATION_PATH);
