//TODO: use custom Constructors instead of extending/constructing String/Array

var _ = require('lodash'),
    ngramString = require('./ngramString.js'),
    ngramArray = require('./ngramArray.js'),
    ngramHash = require('./ngramHash.js'),
    trigramAnalyzer = require('./trigramAnalyzer.js'),
    testString = new String("We repeat ourselves sometimes. We repeat others less often. When we repeat ourselves, it's for fun. When we repeat others, it's for gain.\n\nWhat do we repeat when we repeat ourselves or when we repeat others―I wonder what.\n\nI wonder what bears repeating, whether repeating others or ourselves.");
    
_.extend(String.prototype, ngramString);
_.extend(Array.prototype, ngramArray);
_.extend(Object.prototype, ngramHash);

// testString.getWords();
// testString.getSentences();
// testString.getParagraphs();

function simpleTests(corpus) {
  console.log(corpus.getWords().length);
  console.log(corpus.getSentences().length);
  console.log(corpus.getParagraphs().length);
  console.log(corpus.lastTwoWords().capitalizeFirstWord());
  
  console.log(corpus.getWords().adjacentChunks(3));
  // console.log(corpus.n_grams(3));
  console.log(corpus.getTrigrams());
  
  var patterns = trigramAnalyzer.analyzeText(corpus),
      prettyPatterns = JSON.stringify(patterns, null, 2);
  console.log(prettyPatterns);
}

simpleTests(testString);