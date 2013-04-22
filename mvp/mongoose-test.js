//TODO: Add keyword searching/flagging
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    fs = require('fs'),
    _ = require('lodash'),
    MD = require('markdown').markdown;

console.log('Running mongoose version %s', mongoose.version);

/**
 * Excerpt schema
 */

var excerptSchema = Schema({
    raw: String
  , html: String
  , keywords: [String]
  , wordcount: Number
  , rawlength: Number

})

var Excerpt = mongoose.model('Excerpt', excerptSchema);

/**
 * Connect to the console database on localhost with
 * the default port (27017)
 */

mongoose.connect('mongodb://localhost/zizek', function (err) {
  // if we failed to connect, abort
  if (err) throw err;

  // we connected ok
  parseText("tragedyfarce.txt")
  // createExcerpt("This is second /test/ \\(only a test\\)",
  //               "<p>This is second <em>test</em> (only a test)</p>",
  //               ["test", "only"]);
});

/**
 * Data generation
 */

function parseText(targetFile) {
  var srcData = fs.readFileSync(targetFile),
      srcArray = String.prototype.split.call(srcData, /\n\n/);

  _.each(srcArray, function(text) {
    createExcerpt(text,  MD.toHTML(text), []);
  });

  console.log("Done parsing", srcArray.length, "lines");
}

function createExcerpt (rawText, htmlContent, keywordArray) {
  var e = new Excerpt;
  e.raw = rawText;
  e.html = htmlContent;
  e.keywords = keywordArray;
  e.wordcount = rawText.match(/\s+/g).length + 1 || 0;
  e.rawlength = rawText.length || 0;
  e.save(function (err, record) {
    if (err) throw err;
    // console.log("Created", record);
  })
}

function done (err) {
  if (err) console.error(err);
  Excerpt.remove(function () {
    mongoose.disconnect();
  })
}