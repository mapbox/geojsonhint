var expect = require('expect.js'),
    fs = require('fs'),
    glob = require('glob'),
    geojsonhint = require('../');

function file(x) {
    return fs.readFileSync(x, 'utf8');
}

function filejs(x) {
    return JSON.parse(fs.readFileSync(x, 'utf8'));
}

describe('geojsonhint', function() {
    describe('validates correct files', function(done) {
        glob.sync('test/data/good/*.geojson').forEach(function(f) {
            it('validates ' + f, function() {
                var gj = file(f);
                expect(geojsonhint.hint(gj)).to.eql([]);
            });
        });
    });
    describe('validates incorrect files', function() {
        glob.sync('test/data/bad/*.geojson').forEach(function(f) {
            it('invalidates ' + f, function() {
                var gj = file(f);
                expect(geojsonhint.hint(gj)).to.eql(filejs(f.replace('geojson', 'result')));
            });
        });
    });
});
