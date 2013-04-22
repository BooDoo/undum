//REST server
var express = require('express'),
    fs = require('fs'),
    _ = require('lodash'),
    MD = require('markdown').markdown,
    app = express(),
    corpus = [],
    srcPath = "../txt",
    sources, source,
    s = 0, ss;

//Create the index/cache for corpus:
corpus.index = {};

//Make omniarray of corpus:
sources = fs.readdirSync(srcPath);
for (ss = sources.length; s < ss; s += 1) {
  source = srcPath + "/" + sources[s];
  source = fs.readFileSync(source),
  source = String.prototype.split.call(source, "\n\n");
  corpus = corpus.concat(source, "\n\n");
}



// app.get('/corpus', function(req, res) {
//   res.send([{name:'wine1'}, {name:'wine2'}]);
// });
app.get('/corpus/:word', function(req, res) {
  //Get a random excerpt featuring this word/phrase
  var target = req.params.word.toLowerCase(),
      targetRE = new RegExp (target, "ig"),
      matches, match, matchHTML;

  if (!corpus.index[target]) {
    corpus.index[target] = _.filter(corpus, function (line) {return targetRE.test(line);});
  }

  matches = corpus.index[target];
  match = matches[Math.floor(Math.random() * matches.length)];
  matchHTML = MD.toHTML(match);
  res.send({"matchHTML": matchHTML, "match": match, "index": target });
});
 
app.listen(3000);
console.log('Listening on port 3000...');