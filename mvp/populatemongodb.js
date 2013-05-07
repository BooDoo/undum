//TODO: Add keyword searching/flagging
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    fs = require('fs'),
    _ = require('lodash'),
    MD = require('markdown').markdown,
    corpus = "",
    indexKeys = require('./zizekKeys.js').keys;

// console.log('Running mongoose version %s', mongoose.version);

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
//mongoose.connect('mongodb://nodejitsu_BooDoo:ev8hnogf97ee7m1um43uplqi6a@ds059887.mongolab.com:59887/nodejitsu_BooDoo_nodejitsudb5409955903') // nodejitsu db
//NodeJitsu/MongoLab databse "zizektest":
var connectAndIndex = function connectAndIndex(targetDB, corpusPath) {
  corpusPath = corpusPath || "../txt/";
  targetDB = targetDB || "mongodb://localhost/zizek";
  
  mongoose.connect(targetDB, function(err) {
    // if we failed to connect, abort
    if (err) throw err;
    
    //drop Excerpts collection:
    mongoose.connection.collections['excerpts'].drop(function(err) {
      console.log('dropped excerpts collection');
    });
    
    _.each(fs.readdirSync(corpusPath), function(file) {
      console.log("Reading" + corpusPath + file, "...");
      corpus += "\n\n";
      corpus += fs.readFileSync(corpusPath + file, "utf8");
    });
    
    indexText(corpus);
  });
};
/**
 * Data generation
 */

function indexText(srcText) {
  var srcArray = String.prototype.split.call(srcText, /\n\n/);
  
  var toStore = 0, outputBuffer = "", reTimer = new Date().getTime();
    
  console.log("Starting with",srcArray.length,"Paragraphs");
  
  _.each(srcArray, function(text, para, corpus) {
    var keywords = [];
    
    console.log("Working on",para);
    
    _.each(indexKeys, function(re, key) {
      // console.log("going to test for",key);
      if (re.test(text)) {
        keywords.push(key);
      }
    });
    if (keywords.length > 3) {
      toStore += 1;
      outputBuffer += "\nparagraph " + para + ": " + keywords + "\n...";
      
      //Actually load this record into MongoDB:
      createExcerpt(text, MD.toHTML(text), keywords);
    }
  });

  outputBuffer  += "Done indexing " + srcArray.length + " lines in ~" + (new Date().getTime() - reTimer) + "ms\n" +
                   toStore + "paragraphs have >3 keywords indexed.\n" +
                   (toStore/srcArray.length)*100 + "% paragraphs kept.";
                   
  console.log("Done indexing", srcArray.length, "lines in ~", new Date().getTime() - reTimer, "ms");
  console.log(toStore,"paragraphs have >3 keywords indexed.");
  console.log( (toStore/srcArray.length)*100,"% paragraphs kept.");
  fs.writeFileSync("./indexOutput.txt", outputBuffer);
  done();
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

module.exports.connectAndIndex = connectAndIndex;