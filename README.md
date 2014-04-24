[![Build Status](https://secure.travis-ci.org/mapbox/geojsonhint.png?branch=master)](http://travis-ci.org/mapbox/geojsonhint)

# geojsonhint: complete standards-based validation for geojson

A [lint](http://bit.ly/12jjJyW) tool for the [GeoJSON](http://www.geojson.org/)
standard. geojsonhint is written _to the standard_, with no missing or additional
opinions about structure.

Thanks to `jsonlint-lines`, GeoJSON that is also not valid [JSON](http://json.org/)
will return informative, line-oriented parsing errors.

## api

`errors = geojsonhint.hint(fileAsString)`

Lint a file - given _as a string_ - with the GeoJSON expectations baked in.
An example of the output:

```json
[{
  "message": "\"features\" property should be an array, but is an object instead",
  "line": 1
}]
```

## use it

as a library

    npm install --save geojsonhint

as a web library

    curl https://raw.github.com/mapbox/geojsonhint/master/geojsonhint.js > geojsonhint.js

## binary

Install:

    npm install -g geojsonhint

```
➟ geojsonhint
Usage: geojsonhint FILE.geojson

Options:
  --json  output json-formatted data for hints
```

```
➟ geojsonhint test.geojson
line 9, each element in a position must be a number
```

## developing

Tests:

    npm test

Building the browser version:

    npm install -g browserify
    make

## See Also

* [geojsonhint online](https://www.mapbox.com/geojsonhint/)
* [grunt-geojsonhint](https://github.com/jieter/grunt-geojsonhint) does it as a Grunt task
* [geojsonlint.com](http://geojsonlint.com/) does this server-side
* [GeoJSON-Validation](https://github.com/craveprogramminginc/GeoJSON-Validation) is another node module for this.
* [geojson-assert](https://github.com/calvinmetcalf/geojson-assert) does it in assertion tests
