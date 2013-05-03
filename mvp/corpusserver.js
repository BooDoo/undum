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

//mongoose.connect('mongodb://localhost/zizek', function (err) { //Local database
//NodeJitsu/MongoLab databse "zizektest":
connection = mongoose.connect('mongodb://nodejitsu_BooDoo:ev8hnogf97ee7m1um43uplqi6a@ds059887.mongolab.com:59887/nodejitsu_BooDoo_nodejitsudb5409955903', function(err) {
  // if we failed to connect, abort
  if (err) throw err;
});

//TODO: Pass array _id to exclude built on client side?
app.get('/corpus/:word', function(req, res) {
  //Get a random excerpt featuring this word/phrase
  var target = req.params.word.toLowerCase();
  //TODO: querystring.unescape(target)
  //find a Mongo record with target in its keywords array
  Excerpt.findOne({keywords: target}, 'html keywords wordcount', function(err, excerpt) {
    if (err) throw err;

    _.each(excerpt.keywords, function(key) {
      //TODO: querystring.escape(key)
      excerpt.html = excerpt.html.replace(index[key], '<a class="keyword" href="$/' + key + '">$1</a>');
    });
    
    res.send(excerpt);
  });
});
 
app.listen(3000);
console.log('Listening on port 3000...');

/* On request of keyword, get match from DB then do something like:
var output = excerpt.html
_.each(excerpt.keywords, function(key) {
  output = output.replace(index.keys[key], '<a href="$/' + key + '">$1</a>');
}
return output;
*/