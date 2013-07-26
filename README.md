[![Build Status](https://secure.travis-ci.org/tmcw/geojsonhint.png?branch=master)](http://travis-ci.org/tmcw/geojsonhint)

# geojson lint in js

A [lint](http://bit.ly/12jjJyW) tool for the [GeoJSON](http://www.geojson.org/)
standard.

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

    # as a library
    npm install --save geojsonhint

## binary

Install:

    npm install -g geojsonhint

 ```
 tmcw➟ geojsonhint
Usage: node /usr/local/share/npm/bin/geojsonhint FILE.geojson

Options:
  --json  output json-formatted data for hints
```

```
➟ geojsonhint test.geojson
line 9, each element in a position must be a number
```

## See Also

[geojsonlint.com](http://geojsonlint.com/) does this server-side
