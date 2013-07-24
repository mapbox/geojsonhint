[![Build Status](https://secure.travis-ci.org/tmcw/geojsonhint.png?branch=master)](http://travis-ci.org/tmcw/geojsonhint)

# geojson lint in js

A [lint](http://bit.ly/12jjJyW) tool for the [GeoJSON](http://www.geojson.org/)
standard.

## api

`errors = geojsonhint.hint(fileAsString)`

Lint a file - given _as a string_ - with the GeoJSON expectations baked in.

## install

    # as a binary
    npm install -g geojsonhint

    # as a library
    npm install --save geojsonhint

Use as a binary:

    ➟ geojsonhint test.geojson
    line 9, each element in a position must be a number

## See Also

[geojsonlint.com](http://geojsonlint.com/) does this server-side
