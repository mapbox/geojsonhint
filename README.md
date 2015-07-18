[![Build Status](https://secure.travis-ci.org/mapbox/geojsonhint.svg?branch=master)](http://travis-ci.org/mapbox/geojsonhint) [![Coverage Status](https://coveralls.io/repos/mapbox/geojsonhint/badge.svg)](https://coveralls.io/r/mapbox/geojsonhint)

# geojsonhint: complete, fast, standards-based validation for geojson

A [lint](http://bit.ly/12jjJyW) tool for the [GeoJSON](http://www.geojson.org/)
standard. geojsonhint is written _to the standard_, with no missing or additional
opinions about structure.

Thanks to `jsonlint-lines`, GeoJSON that is also not valid [JSON](http://json.org/)
can return informative, line-oriented parsing errors.

## Specification

The basis of this tool is the published [GeoJSON](http://www.geojson.org/) 1.0 specification.
In the few cases where [draft-geojson](https://github.com/geojson/draft-geojson/blob/master/middle.mkd),
the ietf-candidate version of GeoJSON, is more precise (for instance, [the id property](https://github.com/mapbox/geojsonhint/issues/24)), the validator follows the draft spec as well.

## API

`errors = geojsonhint.hint(string or object)`

Lint a file, given as a string or object. This call detects all aberrations from
the GeoJSON standards and returns them as an array of errors. An example of the output:

```json
[{
  "message": "\"features\" property should be an array, but is an object instead",
  "line": 1
}]
```

## Line Numbers

Note that the GeoJSON can be given as a **string or as an object**. Here's how
to choose which input to use:

* `string` inputs receive **line numbers for each error**. These make errors
  easier to track down if the GeoJSON is hand-written.
* `object` inputs don't have line numbers but are evaluated faster, by up to 10x.
  GeoJSONHint is _very fast already_ so unless you have identified it as a
  bottleneck in your application, don't [prematurely optimize](http://c2.com/cgi/wiki?PrematureOptimization) based
  on this fact.

For byte-minimalists, you can `require('geojsonhint/object')` to get a version
of this library that bypasses jsonlint-lines and provides only the object
interface.

## use it

as a library

    npm install --save geojsonhint

as a web library

    curl https://raw.github.com/mapbox/geojsonhint/master/geojsonhint.js > geojsonhint.js

## As a command-line utility

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
