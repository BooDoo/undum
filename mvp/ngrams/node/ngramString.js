var _ = require('lodash');

module.exports = {
  removeEndPunctuation: function()  {return this.replace(/[.?!]\s*?$/g, '');},
  removeAllPunctuation: function()  {return this.replace(/[\―\/\\\-\*\?\!]/g,' ').replace(/[.?!]\s*?$|[,\"\>\<\[\]]/g,'').replace(/\s\s+/g,' ');},
  getWords: function ()            { return this.words      || (this.words = this.removeAllPunctuation().toLowerCase().trim().split(' ')); },
  getParagraphs: function ()       { return this.paragraphs || (this.paragraphs = _.each(this.split(/\n\n+/), function(el) { return el.trim(); })); },
  getSentences: function ()        { return this.sentences  || (this.sentences = _.reject(this.split(/[.?!(\n+)](?=\s+|$)|[\(\)]/), function(el) {return el.trim() === '';})); },
  word: function(n)                 {if (!this.words) {this.getWords();} return this.words[n-1];},
  firstTwoWords: function()         {if (!this.words) {this.getWords();} return _.first(this.words, 2).join(' ');},
  firstNWords: function(n)           {if (!this.words) {this.getWords();} return _.first(this.words, n).join(' ');},
  lastTwoWords: function()          {if (!this.words) {this.getWords();} return _.last(this.words, 2).join(' ');},
  thirdWord: function()             {return this.word(3); },
  n_grams: function(n)              {
                                       if(!this.words) {this.getWords();}
                                       //return this.words.adjacentChunks(n);
                                       return _.map(this.words.adjacentChunks(n), function(chunk) {if (chunk) return chunk.join(' ');});
                                     },
  getTrigrams: function()              {return this.trigrams   || (this.trigrams = this.n_grams(3)); },
  capitalizeFirstWord: function ()  {return this[0].toUpperCase() + this.slice(1);}
};