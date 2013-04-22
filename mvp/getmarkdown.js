var MD = require('markdown').markdown,
    fs = require('fs'),
    source = fs.readFileSync('../txt/tarrying.txt'),
    srcArray = String.prototype.split.call(source, '\n\n');
    input = srcArray[Math.floor(Math.random() * srcArray.length)],
    output = MD.toHTML(input);

  // console.log(srcArray.length);
  // console.log(input);
  console.log(output);