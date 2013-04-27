var _ = require('lodash'),
    randomEl = function randomEl() {
          var el,
          randIndex,
          keyList, key;
        keyList = _.keys(this)
        randIndex = _.random(0, keyList.length - 1);
        key = keyList[randIndex];
        el = this[key];
     
      return el;
    },
    randomKey = function randomKey() {
      var keys = _.keys(this);
      return keys[_.random(0, keys.length-1)];
    };
    
module.exports = {"randomEl": randomEl, "randomKey": randomKey};