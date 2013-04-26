var _ = require('lodash');

module.exports = {
  adjacentChunks: function (size) {
                    size = size || 1;
                    return _.map(this, function(el, i, arr) {
                      var chunk = arr.slice(i, i+size);
                      if (chunk.length === size) {return chunk;}
                    });
                  }
};

/*
def adjacent_chunks(size = 1)
    self.each_with_index.map do |item, index|
      chunk = self.slice(index, size)
      chunk if chunk.length == size
    end.compact
  end
*/