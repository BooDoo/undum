//TODO: use custom Constructors instead of extending/constructing String/Array

var _ = require('lodash'),
    fs = require('fs'),
    ngramString = require('./ngramString.js'),
    ngramArray = require('./ngramArray.js'),
    ngramHash = require('./ngramHash.js'),
    tTimer,
    trigramAnalyzer = require('./trigramAnalyzer.js');
    
_.extend(String.prototype, ngramString);
_.extend(Array.prototype, ngramArray);
_.extend(Object.prototype, ngramHash);

tTimer = new Date().getTime();

var corpus = "",
    min = 2,
    max = 7,
    threshold = 5,
    counts,
    nTimer,
    testThreshold = function(count, key, obj) {
      if (count < threshold) {
        delete obj[key];
      }
    };
    
_.each(fs.readdirSync("../../../txt/"), function(file) {
  console.log("Reading ../../../txt/" + file, "...");
  corpus += "\n\n";
  corpus += fs.readFileSync("../../../txt/" + file, "utf8");
});
console.log("Built corpus of ~", corpus.length, "characters");

for (var n = max; n >= min; n -= 1) {
  console.log("Starting on " + n + "grams");
  nTimer = new Date().getTime();
  counts = trigramAnalyzer.countParagraphsContaining(corpus, n);
  counts = _.each(counts, testThreshold);
  var prettyCounts = JSON.stringify(counts, null, 2);
  fs.writeFileSync("./output/counts" + n + ".json", prettyCounts);
  console.log("Wrote ./output/counts" + n + ".json after", new Date().getTime() - nTimer, "ms");
}

console.log("Built corpus and counted for", min + "grams to", max +"grams with freq >= " + threshold,"in", new Date().getTime() - tTimer + "ms");