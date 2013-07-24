var jsonlint = require('jsonlint');

function hint(str) {

    var errors = [];

    function root(_) {
        if (!_.type) return 'The type member is required and was not found';
        types[_.type](_);
    }

    function requiredProperty(_, name, type) {
        if (typeof _[name] == 'undefined') {
            return errors.push({
                message: '"' + name + '" property required',
                line: _.__line__
            });
        } else if (type === 'array') {
            if (!Array.isArray(_[name])) {
                return errors.push({
                    message: '"' + name +
                        '" property should be an array, but is an ' +
                        (typeof _[name]) + ' instead',
                    line: _.__line__
                });
            }
        } else if (type && typeof _[name] !== type) {
            return errors.push({
                message: '"' + name +
                    '" property should be ' + (type) +
                    ', but is an ' + (typeof _[name]) + ' instead',
                line: _.__line__
            });
        }
    }

    function FeatureCollection(_) {
        if (!requiredProperty(_, 'features', 'array')) {
            _.features.forEach(Feature);
        }
    }

    // http://geojson.org/geojson-spec.html#positions
    function position(_) {
        if (!Array.isArray(_)) {
            return errors.push({
                message: 'position should be an array, is a ' + (typeof _) +
                    ' instead',
                line: _.__line__
            });
        } else {
            if (_.length < 2) {
                return errors.push({
                    message: 'position must have 2 or more elements',
                    line: _.__line__
                });
            }
            if (_.some(function(p) {
                return (typeof p !== 'number');
            })) {
                return errors.push({
                    message: 'each element in a position must be a number',
                    line: _.__line__
                });
            }
        }
    }

    // http://geojson.org/geojson-spec.html#point
    function Point(_) {
        if (!requiredProperty(_, 'coordinates', 'array')) {
            position(_.coordinates);
        }
    }

    function Polygon(_) {
        requiredProperty(_, 'coordinates', 'array');
    }

    function MultiPolygon(_) {
        requiredProperty(_, 'coordinates', 'array');
    }

    function LineString(_) {
        requiredProperty(_, 'coordinates', 'array');
    }

    function MultiLineString(_) {
        requiredProperty(_, 'coordinates', 'array');
    }

    // http://geojson.org/geojson-spec.html#multipoint
    function MultiPoint(_) {
        requiredProperty(_, 'coordinates', 'array');
    }

    function GeometryCollection(_) {
        if (!requiredProperty(_, 'geometries', 'array')) {
            _.geometries.forEach(root);
        }
    }

    function Feature(_) {
        requiredProperty(_, 'properties', 'object');
        requiredProperty(_, 'geometry', 'object');
    }

    var types = {
        Point: Point,
        Feature: Feature,
        MultiPoint: MultiPoint,
        LineString: LineString,
        MultiLineString: MultiLineString,
        FeatureCollection: FeatureCollection,
        GeometryCollection: GeometryCollection,
        Polygon: Polygon,
        MultiPolygon: MultiPolygon
    };

    try {
        gj = jsonlint.parse(str);
    } catch(e) {
        return e;
    }

    root(gj);

    return errors;
}

module.exports.hint = hint;
