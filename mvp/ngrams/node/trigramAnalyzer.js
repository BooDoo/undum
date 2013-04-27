//TODO: Case-insensitive indexing? Ignore (some?) punctuation?

var _ = require('lodash');

var trigramAnalyzer = {
  analyzeText: function(text, patterns) {
    patterns = patterns || {};
    _.each(text.getSentences(), function(sentence) { this.analyzeSentence(sentence, patterns); }, this);
    return patterns;
  },

  countInText: function(text, n, patterns) {
    patterns = patterns || {};
    n = n || 3;
    _.each(text.getSentences(), function(sentence) { this.countInSentence(sentence, patterns, n); }, this)
    return patterns;
  },

  analyzeSentence: function(sentence, patterns) {
    patterns = patterns || {};
    _.each(sentence.getTrigrams(), function(trigram) {
      var firstTwo = trigram.firstTwoWords();
      patterns[firstTwo] = patterns[firstTwo] || [];
      patterns[firstTwo].push(trigram.thirdWord());
    });
  },

  countParagraphsContaining: function(text, n, corpusPatterns) {
    corpusPatterns = corpusPatterns || {};
    n = n || 3;
    console.log("Working with", text.getParagraphs().length, "paragraphs");
    //For each paragraph:
    _.each(text.getParagraphs(), function (paragraph) {
      var paraPatterns = {};
      
      //Find ngrams in its sentences,
      _.each(paragraph.getSentences(), function (sentence) {
        trigramAnalyzer.countInSentence(sentence, paraPatterns, n);
      });
      
      //For each ngram in it, add to corpus-wide map of ngrams,
      //or increment corpus-wide count by 1 (even if found >once in paragraph)
      _.each(_.keys(paraPatterns), function(key) {
        corpusPatterns[key] ? corpusPatterns[key] += 1 : corpusPatterns[key] = 1;
      });
    });
    
    return corpusPatterns;
  },

  countInSentence: function(sentence, patterns, n) {
    patterns = patterns || {};
    n = n || 3;
    _.each(sentence.n_grams(n), function(ngram) {
      patterns[ngram] ? patterns[ngram] += 1 : patterns[ngram] = 1;
    });
  }
};

module.exports = trigramAnalyzer;