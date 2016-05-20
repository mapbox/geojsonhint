/**
 * @alias geojsonhint
 * @param {(string|object)} GeoJSON given as a string or as an object
 * @param {Object} options
 * @param {boolean} [options.noDuplicateMembers=true] forbid repeated
 * properties. This is only available for string input, becaused parsed
 * Objects cannot have duplicate properties.
 * @returns {Array<Object>} an array of errors
 */
function hint(gj, options) {

    var errors = [];

    function root(_) {

        if ((!options || options.noDuplicateMembers !== false) &&
           _.__duplicateProperties__) {
            errors.push({
                message: 'An object contained duplicate members, making parsing ambigous: ' + _.__duplicateProperties__.join(', '),
                line: _.__line__
            });
        }

        if (!_.type) {
            errors.push({
                message: 'The type property is required and was not found',
                line: _.__line__
            });
        } else if (!types[_.type]) {
            errors.push({
                message: 'The type ' + _.type + ' is unknown',
                line: _.__line__
            });
        } else {
            types[_.type](_);
        }
    }

    function everyIs(_, type) {
        // make a single exception because typeof null === 'object'
        return _.every(function(x) { return (x !== null) && (typeof x === type); });
    }

    function requiredProperty(_, name, type) {
        if (typeof _[name] === 'undefined') {
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

    // http://geojson.org/geojson-spec.html#feature-collection-objects
    function FeatureCollection(featureCollection) {
        crs(featureCollection);
        bbox(featureCollection);
        if (!requiredProperty(featureCollection, 'features', 'array')) {
            if (!everyIs(featureCollection.features, 'object')) {
                return errors.push({
                    message: 'Every feature must be an object',
                    line: featureCollection.__line__
                });
            }
            featureCollection.features.forEach(Feature);
        }
    }

    // http://geojson.org/geojson-spec.html#positions
    function position(_, line) {
        if (!Array.isArray(_)) {
            return errors.push({
                message: 'position should be an array, is a ' + (typeof _) +
                    ' instead',
                line: _.__line__ || line
            });
        } else {
            if (_.length < 2) {
                return errors.push({
                    message: 'position must have 2 or more elements',
                    line: _.__line__ || line
                });
            }
            if (!everyIs(_, 'number')) {
                return errors.push({
                    message: 'each element in a position must be a number',
                    line: _.__line__ || line
                });
            }
        }
    }

    function positionArray(coords, type, depth, line) {
        if (line === undefined && coords.__line__ !== undefined) {
            line = coords.__line__;
        }
        if (depth === 0) {
            return position(coords, line);
        } else {
            if (depth === 1 && type) {
                if (type === 'LinearRing') {
                    if (!Array.isArray(coords[coords.length - 1])) {
                        return errors.push({
                            message: 'a number was found where a coordinate array should have been found: this needs to be nested more deeply',
                            line: line
                        });
                    }
                    if (coords.length < 4) {
                        errors.push({
                            message: 'a LinearRing of coordinates needs to have four or more positions',
                            line: line
                        });
                    }
                    if (coords.length &&
                        (coords[coords.length - 1].length !== coords[0].length ||
                        !coords[coords.length - 1].every(function(position, index) {
                        return coords[0][index] === position;
                    }))) {
                        errors.push({
                            message: 'the first and last positions in a LinearRing of coordinates must be the same',
                            line: line
                        });
                    }
                } else if (type === 'Line' && coords.length < 2) {
                    errors.push({
                        message: 'a line needs to have two or more coordinates to be valid',
                        line: line
                    });
                }
            } else if (!Array.isArray(coords)) {
                errors.push({
                    message: 'a number was found where a coordinate array should have been found: this needs to be nested more deeply',
                    line: line
                });
            } else {
                coords.forEach(function(c) {
                    positionArray(c, type, depth - 1, c.__line__ || line);
                });
            }
        }
    }

    function crs(_) {
        if (!_.crs) return;
        if (typeof _.crs === 'object') {
            var strErr = requiredProperty(_.crs, 'type', 'string'),
                propErr = requiredProperty(_.crs, 'properties', 'object');
            if (!strErr && !propErr) {
                // http://geojson.org/geojson-spec.html#named-crs
                if (_.crs.type === 'name') {
                    requiredProperty(_.crs.properties, 'name', 'string');
                } else if (_.crs.type === 'link') {
                    requiredProperty(_.crs.properties, 'href', 'string');
                } else {
                    errors.push({
                        message: 'The type of a crs must be either "name" or "link"',
                        line: _.__line__
                    });
                }
            }
        } else {
            errors.push({
                message: 'the value of the crs property must be an object, not a ' + (typeof _.crs),
                line: _.__line__
            });
        }
    }

    function bbox(_) {
        if (!_.bbox) { return; }
        if (Array.isArray(_.bbox)) {
            if (!everyIs(_.bbox, 'number')) {
                return errors.push({
                    message: 'each element in a bbox property must be a number',
                    line: _.bbox.__line__
                });
            }
        } else {
            errors.push({
                message: 'bbox property must be an array of numbers, but is a ' + (typeof _.bbox),
                line: _.__line__
            });
        }
    }

    // http://geojson.org/geojson-spec.html#point
    function Point(point) {
        crs(point);
        bbox(point);
        if (!requiredProperty(point, 'coordinates', 'array')) {
            position(point.coordinates);
        }
    }

    // http://geojson.org/geojson-spec.html#polygon
    function Polygon(polygon) {
        crs(polygon);
        bbox(polygon);
        if (!requiredProperty(polygon, 'coordinates', 'array')) {
            positionArray(polygon.coordinates, 'LinearRing', 2);
        }
    }

    // http://geojson.org/geojson-spec.html#multipolygon
    function MultiPolygon(multiPolygon) {
        crs(multiPolygon);
        bbox(multiPolygon);
        if (!requiredProperty(multiPolygon, 'coordinates', 'array')) {
            positionArray(multiPolygon.coordinates, 'LinearRing', 3);
        }
    }

    // http://geojson.org/geojson-spec.html#linestring
    function LineString(lineString) {
        crs(lineString);
        bbox(lineString);
        if (!requiredProperty(lineString, 'coordinates', 'array')) {
            positionArray(lineString.coordinates, 'Line', 1);
        }
    }

    // http://geojson.org/geojson-spec.html#multilinestring
    function MultiLineString(multiLineString) {
        crs(multiLineString);
        bbox(multiLineString);
        if (!requiredProperty(multiLineString, 'coordinates', 'array')) {
            positionArray(multiLineString.coordinates, 'Line', 2);
        }
    }

    // http://geojson.org/geojson-spec.html#multipoint
    function MultiPoint(multiPoint) {
        crs(multiPoint);
        bbox(multiPoint);
        if (!requiredProperty(multiPoint, 'coordinates', 'array')) {
            positionArray(multiPoint.coordinates, '', 1);
        }
    }

    function GeometryCollection(geometryCollection) {
        crs(geometryCollection);
        bbox(geometryCollection);
        if (!requiredProperty(geometryCollection, 'geometries', 'array')) {
            if (!everyIs(geometryCollection.geometries, 'object')) {
                errors.push({
                    message: 'The geometries array in a GeometryCollection must contain only geometry objects',
                    line: geometryCollection.__line__
                });
            }
            geometryCollection.geometries.forEach(function(geometry) {
                if (geometry) root(geometry);
            });
        }
    }

    function Feature(feature) {
        crs(feature);
        bbox(feature);
        // https://github.com/geojson/draft-geojson/blob/master/middle.mkd#feature-object
        if (feature.id !== undefined &&
            typeof feature.id !== 'string' &&
            typeof feature.id !== 'number') {
            errors.push({
                message: 'Feature "id" property must have a string or number value',
                line: feature.__line__
            });
        }
        if (feature.type !== 'Feature') {
            errors.push({
                message: 'GeoJSON features must have a type=feature property',
                line: feature.__line__
            });
        }
        requiredProperty(feature, 'properties', 'object');
        if (!requiredProperty(feature, 'geometry', 'object')) {
            // http://geojson.org/geojson-spec.html#feature-objects
            // tolerate null geometry
            if (feature.geometry) root(feature.geometry);
        }
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

    if (typeof gj !== 'object' ||
        gj === null ||
        gj === undefined) {
        errors.push({
            message: 'The root of a GeoJSON object must be an object.',
            line: 0
        });
        return errors;
    }

    root(gj);

    errors.forEach(function(err) {
        if (err.hasOwnProperty('line') && err.line === undefined) {
            delete err.line;
        }
    });

    return errors;
}

module.exports.hint = hint;
