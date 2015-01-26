var Benchmark = require('benchmark'),
    fs = require('fs'),
    hint = require('./');

global.dataString = fs.readFileSync('test/data/bad/bad-polygonloop.geojson');
global.dataObject = JSON.parse(global.dataString);
var suite = new Benchmark.Suite('turf-within');
suite
  .add('hint-string',function () {
    hint.hint(global.dataString);
  })
  .add('hint-object',function () {
    hint.hint(global.dataObject);
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
  })
  .run();
