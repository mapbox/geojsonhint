var test = require('tap').test,
    fs = require('fs'),
    glob = require('glob'),
    fuzzer = require('fuzzer'),
    geojsonhint = require('../');

function file(x) {
    return fs.readFileSync(x, 'utf8');
}

function filejs(x) {
    return JSON.parse(fs.readFileSync(x, 'utf8'));
}

test('geojsonhint', function(t) {
    glob.sync('test/data/good/*.geojson').forEach(function(f) {
        var gj = file(f);
        t.deepEqual(geojsonhint.hint(gj), [], 'good input: ' + f);
    });
    t.deepEqual(geojsonhint.hint(undefined), [{
        message: 'Expected string input',
        line: 0
    }]);
    t.deepEqual(geojsonhint.hint('{}'), [{
        message: 'The type property is required and was not found',
        line: 1
    }]);
    test('validates incorrect files', function(t) {
        glob.sync('test/data/bad/*.geojson').forEach(function(f) {
            var gj = file(f);
            t.deepEqual(geojsonhint.hint(gj), filejs(f.replace('geojson', 'result')));
        });
        t.end();
    });
    test('invalid roots', function(t) {
        t.deepEqual(geojsonhint.hint('null'), [{
            message: 'The root of a GeoJSON object must be an object.',
            line: 0
        }]);
        t.deepEqual(geojsonhint.hint('1'), [{
            message: 'The root of a GeoJSON object must be an object.',
            line: 0
        }]);
        t.deepEqual(geojsonhint.hint('"string"'), [{
            message: 'The root of a GeoJSON object must be an object.',
            line: 0
        }]);
        t.end();
    });
    glob.sync('test/data/good/*.geojson').forEach(function(f) {
        var mutator = fuzzer.mutate.object(filejs(f));
        for (var i = 0; i < 100; i++) {
            try {
                var input = mutator();
                geojsonhint.hint(input);
                t.ok('done');
            } catch(e) {
                t.fail('exception on ' + JSON.stringify(input));
            }
        }
    });
    t.end();
});
