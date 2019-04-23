geojsonhint

usage:

  geojsonhint < file.geojson

options:

--format -f

  options are pretty, json, compact. pretty is the default.

--noDuplicateMembers

  if set to false, geojsonhint will permit repeated properties.

--rightHandRule

  if set to false, geojsonhint will not reject Polygons that do not follow the right-hand rule