//var assert = require("assert");

var 
  helpers = require('../lib/helpers.js')
  ,should = require('should');


suite('helpers.sortArryOnProp', function() {
  suite('Sort ascending and descending', function() {

    test('Test sort ascending', function() {
      var objArray = [{name: 'a', position: 10}, 
                      {name: 'c', position: 5}, 
                      {name: 'b', position: 0}];
      var ascending = true;
      helpers.sortArrayOnProp(objArray, "position", ascending);
      objArray[0].name.should.equal('b')
    });
    
    test('Test sort descending', function() {
      var objArray = [{name: 'a', position: 10}, 
                      {name: 'c', position: 5}, 
                      {name: 'b', position: 0}];
      var ascending = false;
      helpers.sortArrayOnProp(objArray, "position", ascending);
      objArray[0].name.should.equal('a')
    });
  })
});

suite('helpers.getDateAndTitle', function() {
  var markdown;
  var ENCODING = 'utf8';

  setup(function(){
    markdown = new Buffer("2013-04-23\n#Blog Title\nSome text.", 'utf8');
  });

  suite('getDateAndTitle extract title and date', function() {

    test('Check correct title', function() {
      var result = helpers.getDateAndTitle(markdown, ENCODING).title;
      "Blog Title".should.equal(result);
    });

    test('Check handling empty file, title', function() {
      var result = 
        helpers.getDateAndTitle(new Buffer("", 'utf8'), 
                                ENCODING).title;
      "Untitled".should.equal(result);
    });

    test('Check handling empty file, date', function() {
      var date = new Date();
      var result = 
        helpers.getDateAndTitle(new Buffer("", 'utf8'), 
                                ENCODING).date;
      date.getDate().should.equal(new Date(result).getDate());
    });
    test('Check date is testdate "2013-04-23"', function() {
      var result = helpers.getDateAndTitle(markdown, ENCODING).date;
      "2013-04-23".should.equal(result);
    });

    test('Check correct fileName', function() {
      var result = helpers.getDateAndTitle(markdown, ENCODING).fileName;
      "Blog-Title".should.equal(result);
    });
  });

  teardown(function(){
    
  });

});