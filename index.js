function lint(gj) {
    function root(_) {
        if (!_.type) return 'The type member is required and was not found';
        types[_.type](_);
    }

    function FeatureCollection(_) {
    }

    function Point(_) {
    }

    function Polygon(_) {
    }

    function MultiPolygon(_) {
    }

    function LineString(_) {
    }

    function MultiLineString(_) {
    }

    function MultiPoint(_) {
    }

    var types = {
        Point: Point,
        MultiPoint: MultiPoint,
        LineString: LineString,
        FeatureCollection: FeatureCollection,
        Polygon: Polygon,
        MultiPolygon: MultiPolygon
    };

    return root(gj);
}
