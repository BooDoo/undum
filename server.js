//REST server
var express       = require('express'),
    fs            = require('fs'),
    _             = require('lodash'),
    mongoose      = require('mongoose'),
    Schema        = mongoose.Schema,
    connection,
    MD            = require('markdown').markdown,
    app           = express(),
    excerptSchema = Schema({
                        raw: String,
                        html: String,
                        keywords: [String],
                        wordcount: Number,
                        rawlength: Number,
                        counter: Number
                    }),
    Excerpt       = mongoose.model('Excerpt', excerptSchema),
    corpus        = "",
    index         = require('./zizekKeys.js').keys,
    corpusPath    = "./txt/",
    haikus        = fs.readFileSync("./haiku.txt", "utf8").split("\n\n"),
    markovs       = fs.readFileSync("./markov.txt", "utf8").split("\n\n"),
    targetDB      = process.env.CORPUSDB || 'mongodb://nodejitsu_boodoo:mekfq04ojosc0u97vaq95vr3vt@ds059917.mongolab.com:59917/nodejitsu_boodoo_nodejitsudb8058334328' || 'mongodb://localhost/corpus'; //'mongodb://nodejitsu_boodoo:mekfq04ojosc0u97vaq95vr3vt@ds059917.mongolab.com:59917/nodejitsu_boodoo_nodejitsudb8058334328' //'mongodb://nodejitsu_BooDoo:ev8hnogf97ee7m1um43uplqi6a@ds059887.mongolab.com:59887/nodejitsu_BooDoo_nodejitsudb5409955903'

//SHOULD DO:
// - Connect to db
// - Check if 'excerpts' collection exists
// - Leave it alone if it does, unless "forceIndex" is passed

var startServer = function startServer(targetDB, corpusPath, doIndex) {
  corpusPath = corpusPath || "./txt/";
  targetDB = targetDB || "mongodb://localhost/corpus";
  doIndex = doIndex || false;
  
  mongoose.connect(targetDB, function(err) {
    // if we failed to connect, abort
    if (err) throw err;
    
    Excerpt.findOne({"wordcount": {$gt: 0}}, function(err, exc) {
      //if (err) console.log(err);
      //console.log("Excerpt.findOne =", exc);
      if (exc === null || typeof exc === "undefined") {
        console.log("No excerpts found.")
        //doIndex = true;
      }

      //If there is no excerpts collection, or if we force a re-index:
      if (doIndex) {
        console.log ("Indexing corpus from " + corpusPath);
        
        mongoose.connection.collections['excerpts'].drop(function(err) {
          console.log('dropped excerpts collection (if existing)');

          //Rebuild corpus:
          _.each(fs.readdirSync(corpusPath), function(file) {
            console.log("Reading" + corpusPath + file, "...");
            corpus += "\n\n";
            corpus += fs.readFileSync(corpusPath + file, "utf8");
          });
          
          //Index it and push to 'excerpts' collection
          indexText(corpus);
        });
      }
      //Otherwise take no action on collections...
      else {
        console.log ("Excerpts collection exists, starting server");
        app.listen(3000);
        console.log('Listening on port 3000...');
      }
    });
  });
};

/**
 * Data generation -- WORKS FINE
 */
function indexText(srcText) {
  var srcArray = String.prototype.split.call(srcText, /\n\n/);
  
  var toStore = 0, outputBuffer = "", reTimer = new Date().getTime();
    
  console.log("Starting with",srcArray.length,"Paragraphs...");
  
  _.each(srcArray, function(text, para, corpus) {
    var keywords = [];
    
    //console.log("Working on",para);
    
    _.each(index, function(re, key) {
      // console.log("going to test for",key);
      if (re.test(text)) {
        keywords.push(key);
      }
    });
    if (keywords.length > 3) {
      toStore += 1;
      outputBuffer += "\nparagraph " + para + ": " + keywords + "\n...";
      
      //Actually load this record into MongoDB:
      createExcerpt(text, MD.toHTML(text), keywords, para);
    }
  });

  outputBuffer  += "Done indexing " + srcArray.length + " lines in ~" + (new Date().getTime() - reTimer) + "ms\n" +
                   toStore + "paragraphs have >3 keywords indexed.\n" +
                   (toStore/srcArray.length)*100 + "% paragraphs kept.";
                   
  console.log("Done indexing", srcArray.length, "lines in ~", new Date().getTime() - reTimer, "ms");
  console.log(toStore,"paragraphs have >3 keywords indexed.");
  console.log( (toStore/srcArray.length)*100,"% paragraphs kept.");
  fs.writeFileSync("./indexOutput.txt", outputBuffer);


  //All done! start the server
  app.listen(3000);
  console.log('Listening on port 3000...');
}

//TOTALLY SAFE/OK Schema/Mongoose BITS:
function createExcerpt (rawText, htmlContent, keywordArray, counter) {
  var e = new Excerpt;
  e.raw = rawText;
  e.html = htmlContent;
  e.keywords = keywordArray;
  e.wordcount = rawText.match(/\s+/g).length + 1 || 0;
  e.rawlength = rawText.length || 0;
  e.counter = counter || 0;
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

startServer(targetDB, corpusPath);

//Point static root to the /games folder of the undum tree
app.use('/', express.static('./games/'));
app.use(express.bodyParser());

//Added and testing: POST approach to allow for array of _id to omit.
app.post('/corpus', function(req, res) {
  console.log(req.body);
  console.log(JSON.stringify(req.body,null,2));
  var target = decodeURIComponent(req.body.keyword.toLowerCase()),
      served = req.body.served || null,
      findQuery = {keywords: target};
      if (served) {
        findQuery._id = {$nin: served};
      }

  if (target === "h") {
    var haiku = haikus[Math.floor(Math.random()*haikus.length)];
    res.send({html: MD.toHTML(haiku).replace(/\n/g,"<br />")});
  }
  else if (target === "m") {
    var markov = markovs[Math.floor(Math.random()*markovs.length)];
    res.send({html: MD.toHTML(markov).replace(/\n/g,"<br />")});
  }
  else {
    Excerpt.find(findQuery, 'html keywords wordcount', function(err, excerpts) {
      if (err) throw err;
      var excerpt = excerpts[Math.floor(Math.random()*excerpts.length)];
      _.each(excerpt.keywords, function(key) {
        excerpt.html = excerpt.html.replace(index[key], '<a class="make" href="./$' + encodeURIComponent(key) + '">$1</a>');
      });
      
      res.send(excerpt);
      console.log("Served _id:", excerpt._id, "for keyword:", target);
    });
  }
});

//Obsolete, use app.post above instead.
app.get('/corpus/:word', function(req, res) {
  //Get a random excerpt featuring this word/phrase
  var target = decodeURIComponent(req.params.word.toLowerCase());
  console.log("Keyword received:",target);
  
  //find a Mongo record with target in its keywords array
  Excerpt.find({keywords: target}, 'html keywords wordcount', function(err, excerpts) {
    if (err) throw err;
    var excerpt = excerpts[Math.floor(Math.random()*excerpts.length)];
    _.each(excerpt.keywords, function(key) {
      excerpt.html = excerpt.html.replace(index[key], '<a class="make" href="./$' + encodeURIComponent(key) + '">$1</a>');
    });
    
    res.send(excerpt);
    console.log("Served _id:", excerpt._id, "for keyword:", target);
  });
});