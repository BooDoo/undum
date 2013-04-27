var _ = require('lodash'),
    fs= require('fs');
    
_.each(fs.readdirSync("./output/"), function(file) {
  var countObj = JSON.parse(fs.readFileSync("./output/" + file, "utf8")),
      countCSV = "Gram,Count\n";
      
  _.each(countObj, function (val, key) {
    countCSV += String.prototype.replace.call(key, /,/,"\\,") + "," + val + "\n";
  });
  
  fs.writeFileSync("./output/" + file + ".csv", countCSV);
});