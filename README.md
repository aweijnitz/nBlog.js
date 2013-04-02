2013-04-02
# Introducing nBlog
##A static file blog engine using Markdown syntax

Build status: [![Build Status](https://travis-ci.org/aweijnitz/nBlog.js.png)](https://travis-ci.org/aweijnitz/nBlog.js)

## Installation
The only way to install is currently by cloning or downloading from this repository on Github. Do the following:

1. Clone from github `git clone https://github.com/aweijnitz/nBlog.js`
2. In a terminal window, change dir to the project directory
3. Do `npm install` to download all dependencies
4. Verify the basic operation by running the tests `npm test`
5. DONE! See *How to use* next.

## How to use

### Generating the blog
Just point nBlog.js to a directory full of blog posts in Markdown format and point it to the output directory (*./public*). Posts need to follow a simple convention to work properly (see below). The generated HTML files will be put in a sub directory called *posts* in the destination dir.
`node nBlog.js <sourceDir> <destDir>`

### Blog post syntax and conventions
nBlog expects the first line of the post to be a date and the second line to be the blog title. Incidently, this file (*README.md*) follows this convention and can serve as an example.

## Extending or modifying nBlog.js

### Architecture/How it works
The basic flow of execution is quite straight forward. nBlog.js can be invoked either from the command line or programatically. It, in turn, will just forward the call to the compiler module and ask it to convert all Markdown posts in a folder into HTML files in the output folder. All actual file system interaction is handled by the module *datasources.js*. 

####Step by step it looks like this
1. Invoke nBlog with srcDir and destDir.
2. The compiler in turn asks the datasources module to process the files in the srcDir, passing a function to be applied to all files as an argument.
3. The files are put in a compile queue and the processing begins.
4. As files are converted, a record is kept over the files being processed. This record is used to build the archive links in the next step. This way, all files are processed in one pass.
5. When all jobs are completed, the queue.drain event is fired and a callback invoked which builds the archive from the list built in step 4.

### Modifying the blog templates
Assuming you are familiar with twitter boostrap, modifying the blog template (*./lib/templates/index.mustache*) should be straight forward. If you you are not familiar with Twitter Bootstrap, well, you will probably have to start here [Bootstrap](http://twitter.github.com/bootstrap/). Additinally, you will want to peek inside the file *./public/js/main-ui.js*.


![Screenshot](http://i.imgur.com/XpKqRRP.png)


### Running the tests
Testing is done using [Mocha](http://visionmedia.github.com/mocha/) and [Should](https://github.com/visionmedia/should.js). Tests are stored in the folder `./tests` in the root project folder.

* Running the tests: `npm test`

## Known issues
- There seem to be an issue with using Node v0.8.x. The code was developed uisng Node v0.10.2 and last time I installed a node version manager (n), it wrecked havoc. Not keen on trying again.
- The first time you view a single post, the "Next post" is enabled, but doesn't do anything. Should either load the next post or not be there. 


## Next steps
- Introduce proper configuration management (at least a settings file).
- Refactor the storage manager (datasources.js) and introduce Git support to be able to read blog posts directly from a git repository.
- Finish the test data generator (postgenerator.js) and use in the test suite.
- General cleaning. Most of it was written within a 72h timespan and could use a second look.
- Add browser testing using phantom.js

