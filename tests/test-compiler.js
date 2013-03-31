var 
  compiler = require('../lib/compile.js'),
  H = require('../lib/helpers.js'),
  should = require('should');

var ENCODING = 'utf8';
var TESTDATA = './test-data/';

suite('Compile blog posts', function() {
  var singlePostMarkdown;

  setup(function(){
    singlePostMarkdown = "2013-04-23\n#Hello\nSome text.";
  });

  suite('Compile single entry', function() {

    test('compileBlogPost', function() {
      var result = compiler.compileBlogPost(singlePostMarkdown);
      //console.log(result.match(/Hello/g));
      result.match(/Hello/g)[0].should.equal('Hello'); 
    });

  });

  teardown(function(){
    // promiseFS.unlinkSync(destinationFile);
  });

});