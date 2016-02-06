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
        t.deepEqual(geojsonhint.hint(gj), [], f);
    });
    t.deepEqual(geojsonhint.hint(undefined), [{
        message: 'Expected string or object as input',
        line: 0
    }], 'expected string input');
    t.deepEqual(geojsonhint.hint('{}'), [{
        message: 'The type property is required and was not found',
        line: 1
    }], 'just an object');
    test('validates incorrect files', function(t) {
        glob.sync('test/data/bad/*.geojson').forEach(function(f) {
            var gj = file(f);
            if (process.env.UPDATE) {
                fs.writeFileSync(f.replace('geojson', 'result'), JSON.stringify(geojsonhint.hint(gj), null, 2));
            }
            t.deepEqual(geojsonhint.hint(gj), filejs(f.replace('geojson', 'result')), f);
        });
        t.end();
    });
    test('validates incorrect files as objects', function(t) {
        glob.sync('test/data/bad/*.geojson').forEach(function(f) {
            if (f === 'test/data/bad/bad-json.geojson') return;
            var gj = filejs(f);
            if (process.env.UPDATE) {
                fs.writeFileSync(f.replace('geojson', 'result-object'), JSON.stringify(geojsonhint.hint(gj), null, 2));
            }
            t.deepEqual(geojsonhint.hint(gj), filejs(f.replace('geojson', 'result-object')), f);
        });
        t.end();
    });
    test('invalid roots', function(t) {
        t.deepEqual(geojsonhint.hint('null'), [{
            message: 'The root of a GeoJSON object must be an object.',
            line: 0
        }], 'non-object root');
        t.deepEqual(geojsonhint.hint('1'), [{
            message: 'The root of a GeoJSON object must be an object.',
            line: 0
        }], 'number root');
        t.deepEqual(geojsonhint.hint('"string"'), [{
            message: 'The root of a GeoJSON object must be an object.',
            line: 0
        }], 'string root');
        t.end();
    });
    glob.sync('test/data/good/*.geojson').forEach(function(f) {
        var mutator = fuzzer.mutate.object(filejs(f));
        for (var i = 0; i < 100; i++) {
            try {
                var input = mutator();
                geojsonhint.hint(input);
            } catch(e) {
                t.fail('exception on ' + JSON.stringify(input));
            }
        }
    });
    t.end();
});