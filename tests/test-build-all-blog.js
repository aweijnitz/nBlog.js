var 
  compiler = require('../lib/compile.js'),
  H = require('../lib/helpers.js'),
  generator = require('../lib/postgenerator.js'),
  blog = require('../nBlog.js'),
  fs = require("promised-io/fs");
  should = require('should');

// defaults (read from config later)
var ENCODING = 'utf-8';
var SOURCE_PATH = './test-data';
var DESTINATION_PATH = './public';
var INDEX_FILE = './public/index.html';

var generateTestPosts = function(dir) {
  // TODO: Use geenrator.generate, but need to switch to promised based model
}

var removeTestPosts = function(dir) {
  generator.cleanup(dir);
}

var removeGeneratedPosts = function(dir) {
  generator.cleanup(dir);
}

var removeIndexFile = function() {
  fs.unlinkSync(INDEX_FILE);
}

suite('Build complete blog, end-to-end', function() {
  // setup(function(){

  // });

  suite('Verify build posts and index file', function() {

    test('Test build posts only', function() {
      blog.buildBlog(SOURCE_PATH, DESTINATION_PATH, true).then(function(result){
        result.should.be.true;
        done();
      }, function(err) {
        throw new Error('failed to build. ' + err);
        done();
      })      
    });

    test('Test build complete blog', function() {
      blog.buildBlog(SOURCE_PATH, DESTINATION_PATH, false).then(function(result){
        result.should.be.true;
        done();
      }, function(err) {
        throw new Error('failed to build. ' + err);
        done();
      })      
    });

  });

  suite('Check blog output', function() {
  
    test('Test blog title', function() {
      fs.readFile(INDEX_FILE, ENCODING).then(function(result){
        var indexFile = result;
        indexFile.match(/Socket/g)[0].should.equal('Socket');
        done();
      }, function(err) {
        throw new Error('failed to read index.html. ' + err);
        done();
      });      

    });
  
  });

  teardown(function(){
    // console.log("TEARDOWN DIRNAME "+__dirname);
    //removeGeneratedPosts(DESTINATION_PATH+'/posts');
    //removeIndexFile();
  });

});