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
    it('requires an input', function() {
        expect(geojsonhint.hint(undefined)).to.eql([{
            message: 'Expected string input',
            line: 0
        }]);
    });
    it('requires a root type', function() {
        expect(geojsonhint.hint('{}')).to.eql([{
            message: 'The type property is required and was not found',
            line: 1
        }]);
    });
    describe('validates incorrect files', function() {
        glob.sync('test/data/bad/*.geojson').forEach(function(f) {
            it('invalidates ' + f, function() {
                var gj = file(f);
                expect(geojsonhint.hint(gj)).to.eql(filejs(f.replace('geojson', 'result')));
            });
        });
    });
    describe('invalid roots', function() {
        it('null', function() {
            expect(geojsonhint.hint('null')).to.eql([{
                message: 'The root of a GeoJSON object must be an object.',
                line: 0
            }]);
        });
        it('number', function() {
            expect(geojsonhint.hint('1')).to.eql([{
                message: 'The root of a GeoJSON object must be an object.',
                line: 0
            }]);
        });
        it('string', function() {
            expect(geojsonhint.hint('"string"')).to.eql([{
                message: 'The root of a GeoJSON object must be an object.',
                line: 0
            }]);
        });
    });
});
