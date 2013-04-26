var _ = require('lodash');

module.exports = {
  removeEndPunctuation: function()  {return this.replace(/[.?!]\s*?$/, '')},
  makeWords: function ()            { this.words = this.removeEndPunctuation().split(' '); return this.words;},
  makeParagraphs: function ()       { this.paragraphs = _.each(this.split(/\n+/), function(el) { return el.trim(); }); return this.paragraphs;},
  makeSentences: function ()        { this.sentences = _.reject(this.split(/[.?!(\n+)](?=\s+|$)/), function(el) {return el.trim() === '';}); return this.sentences;},
  word: function(n)                 {if (!this.words) {this.makeWords();} return this.words[n-1];},
  firstTwoWords: function()         {if (!this.words) {this.makeWords();} return _.first(this.words, 2).join(' ');},
  lastTwoWords: function()          {if (!this.words) {this.makeWords();} return _.last(this.words, 2).join(' ');},
  thirdWord: function()             {return this.word(3); },
  n_grams: function(n)              {
                                       if(!this.words) {this.makeWords();}
                                       return _.map(this.words.adjacent_chunks(n), function(chunk) {return chunk.join(' ');});
                                     },
  trigrams: function()              {return this.n_grams(3);},
  capitalizeFirstWord: function ()  {return this[0].toUpperCase() + this.slice(1);}
};