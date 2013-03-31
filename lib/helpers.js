
// Sorts an array of objects "in place". 
// (Meaning that the original array will be modified and nothing gets returned.)
// From: http://stackoverflow.com/questions/8900732/javascript-sort-objects-in-an-array-alphabetically-on-one-property-of-the-arra

function sortOn (arr, prop, ascending) {
  var order = 1;
  if(!ascending) order *= -1;  
  arr.sort (
      function (a, b) {
          if (a[prop] < b[prop]){
              return -1*order;
          } else if (a[prop] > b[prop]){
              return 1*order;
          } else {
              return 0;   
          }
      }
  );
}

// Given a Markdown buffer for a blog post,
// extract date and title and return object with result.
// 
var getDateAndTitle = function(markdownData, ENCODING) {
  var lines = markdownData.toString(ENCODING).split("\n");
  var dateStr = lines[0]; // By convention, date will be in the first line
  var title = lines[1]; // By convention, blog post title will be second

  if(dateStr == null || dateStr.length <= 0) {
    var date = new Date();
    dateStr = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
  }
    
  if(title == null || title.length <= 0)
    title = "Untitled";

  title = title.replace(/#*/g,""); // Strip markdown heading '#' markers
  var fileName = (title.replace(/\s/g, "-")); // handle whitespace

  return {
    "title": title,
    "fileName": encodeURIComponent(fileName),
    "date": dateStr
  }
}

module.exports = {
  sortArrayOnProp: sortOn,
  getDateAndTitle: getDateAndTitle
};
