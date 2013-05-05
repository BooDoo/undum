//REST server
var express       = require('express'),
    //fs          = require('fs'),
    _             = require('lodash'),
    mongoose      = require('mongoose'),
    Schema        = mongoose.Schema,
    connection,
    //MD          = require('markdown').markdown,
    app           = express(),
    excerptSchema = Schema({
                        raw: String,
                        html: String,
                        keywords: [String],
                        wordcount: Number,
                        rawlength: Number
                    }),
    Excerpt       = mongoose.model('Excerpt', excerptSchema),
    index         = require('./zizekKeys.js').keys;

connection = mongoose.connect('mongodb://localhost/zizek', function (err) { //Local database
//NodeJitsu/MongoLab databse "zizektest":
//connection = mongoose.connect('mongodb://nodejitsu_BooDoo:ev8hnogf97ee7m1um43uplqi6a@ds059887.mongolab.com:59887/nodejitsu_BooDoo_nodejitsudb5409955903', function(err) {
  // if we failed to connect, abort
  if (err) throw err;
  console.log("Connected to mongodb");
});

//Point root to the /games folder of the undum tree
app.use('/', express.static('../games/'));

//TODO: Pass array of _ids to exclude, maintained client-side?
app.get('/corpus/:word', function(req, res) {
  //Get a random excerpt featuring this word/phrase
  var target = decodeURIComponent(req.params.word.toLowerCase());
  console.log("As received:",req.params.word,"\nAfter decodeURIComponent:",target)
  
  //find a Mongo record with target in its keywords array
  Excerpt.find({keywords: target}, 'html keywords wordcount', function(err, excerpts) {
    if (err) throw err;
    var excerpt = excerpts[Math.floor(Math.random()*excerpts.length)];
    _.each(excerpt.keywords, function(key) {
      //TODO: querystring.escape(key)
      excerpt.html = excerpt.html.replace(index[key], '<a class="make" href="./$' + encodeURIComponent(key) + '">$1</a>');
    });
    
    res.send(excerpt);
    console.log("Served _id:", excerpt._id, "for keyword:", target);
  });
});
 
app.listen(3000);
console.log('Listening on port 3000...');