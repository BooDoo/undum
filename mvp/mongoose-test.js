//TODO: Add keyword searching/flagging
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    fs = require('fs'),
    _ = require('lodash'),
    MD = require('markdown').markdown,
    corpus = "",
    indexKeys = require('./zizekKeys.js').keys;

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

});

var Excerpt = mongoose.model('Excerpt', excerptSchema);

/**
 * Connect to the console database on localhost with
 * the default port (27017)
 */

//mongoose.connect('mongodb://localhost/zizek', function (err) { //Local database
//NodeJitsu/MongoLab databse "zizektest":
mongoose.connect('mongodb://nodejitsu_BooDoo:ev8hnogf97ee7m1um43uplqi6a@ds059887.mongolab.com:59887/nodejitsu_BooDoo_nodejitsudb5409955903', function(err) {
  // if we failed to connect, abort
  if (err) throw err;
  
  /*
  _.each(fs.readdirSync("../txt/"), function(file) {
    console.log("Reading ../txt/" + file, "...");
    corpus += "\n\n";
    corpus += fs.readFileSync("../txt/" + file, "utf8");
  });
  */
  // corpus = fs.readFileSync("./ngrams/node/testsource.txt", "utf8");
  corpus += fs.readFileSync("../txt/tragedyfarce.txt", "utf8");
  
  parseText(corpus);
  // createExcerpt("This is second /test/ \\(only a test\\)",
  //               "<p>This is second <em>test</em> (only a test)</p>",
  //               ["test", "only"]);
});

/**
 * Data generation
 */

function parseText(srcText) {
  var srcArray = String.prototype.split.call(srcText, /\n\n/);
  
  var toStore = 0, outputBuffer = "", reTimer = new Date().getTime();
    
  console.log("Starting with",srcArray.length,"Paragraphs");
  
  _.each(srcArray, function(text, para, corpus) {
    var keywords = [];
    
    console.log("Working on",para);
    
    _.each(indexKeys, function(re, key) {
      if (re.test(text)) {
        keywords.push(key);
      }
    });
    if (keywords.length > 3) {
      toStore += 1;
      outputBuffer += "\nparagraph " + para + ": " + keywords;
      /*
      _.each(keywords, function (key, ind) {
        outputBuffer(text.match(indexKeys[key]));
      });
      */
      outputBuffer += "\n...";
      // createExcerpt(text,  MD.toHTML(text), keywords);
    }
  });

  outputBuffer  += "Done parsing " + srcArray.length + " lines in ~" + (new Date().getTime() - reTimer) + "ms\n" +
                   toStore + "paragraphs have >3 keywords indexed.\n" +
                   (toStore/srcArray.length)*100 + "% paragraphs kept.";
                   
  console.log("Done parsing", srcArray.length, "lines in ~", new Date().getTime() - reTimer, "ms");
  console.log(toStore,"paragraphs have >3 keywords indexed.");
  console.log( (toStore/srcArray.length)*100,"% paragraphs kept.");
  fs.writeFileSync("./indexOutput.txt", outputBuffer);
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