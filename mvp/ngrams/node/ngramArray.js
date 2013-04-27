var _ = require('lodash');

module.exports = {
  adjacentChunks: function (size) {
                    size = size || 1;
                    return _.map(this, function(el, i, arr) {
                      var chunk = arr.slice(i, i+size);
                      if (chunk && chunk.length === size) {return chunk;}
                    }).filter(function(chunk) {return !_.isEmpty(chunk);});
                  }
};