
var UI = function() {

  // Get JSON archive
  var archiveURL = "posts/archive_links.json";
  var archiveMenu = "posts/archive_links.html";
  var archive = []; // Holds info-objects for loading all posts
  var nextPost = 0;

  // Load archive links
  loadArchiveMenuLinks(archiveMenu);

  // Load archive info and latest posts
  $.getJSON(archiveURL).then(function(result) {
    archive = result;
  },
  function(err) {
    console.error("No JSON for archive links!");
  }).then(function(result) {
    // update blogpost here and add two more posts at the end
    if(archive.length > 0) 
      updateMainPost(archive[nextPost++]);
    if(archive.length > 1) 
      addPost(archive[nextPost++]);
    if(archive.length > 2) 
      addPost(archive[nextPost++]);
  });

  // Add action for "More posts" button
  $('#next-post').click(function(){
    if(archive.length <= nextPost) {
      $(this).addClass('disabled')
      return false;
    }
    addPost(archive[nextPost++]);
    return false; 
  })

  $('#next-post').removeClass("disabled"); // Corner case

}

var updateMainPost = function(info) {
  $("#latest_content").load(info.file);
} 


var loadArchiveMenuLinks = function(url) {
  $("#archive-links").load(url, function() {
    $('.archive-link').click(function(){ 
      var href = $(this).attr('href');
      updateMainPost({ file: href }); 
      removePosts();
      $('#next-post').addClass("disabled");
      return false; 
    })
  });
}


var addPost = function(info) {
  $('<div class="post row span8" />').load(info.file)
  .insertBefore($("#next_post"));
}


var removePosts = function() {
  $(".post").remove();
}
