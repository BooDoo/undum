var fs = require('fs'),
		_  = require('lodash'),
		trigrams = JSON.parse(fs.readFileSync("./trigrams.json")),
		uniqueTrigrams;

_.forEach(trigrams, function (el,key,arr) {
  arr[key] = _.unique(el);
});

uniqueTrigrams = JSON.stringify(trigrams, null, 2);
fs.writeFile("./uniques.json", uniqueTrigrams, function() {console.log("Output complete!");})
