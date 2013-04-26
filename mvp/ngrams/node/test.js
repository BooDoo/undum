//TODO: hash.rb, trigram_analyzer.rb, trigram_generator.rb
//TODO: use custom Constructors instead of extending/constructing String/Array

var _ = require('lodash'),
    ngramString = require('./ngramString.js'),
    ngramArray = require('./ngramArray.js'),
    ngramHash = require('./ngramHash.js'),
    testString = new String("The boy bought the basketball. He learned to play! It was awesome.");
    
_.extend(String.prototype, ngramString);
_.extend(Array.prototype, ngramArray);
_.extend(Object.prototype, ngramHash);

console.log(testString.makeWords());
console.log(testString.words || "no .words");
console.log(testString.makeSentences());
console.log(testString.makeParagraphs());
console.log(testString.lastTwoWords().capitalizeFirstWord());
console.log(testString.words.adjacentChunks(3));