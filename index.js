var CodeMirror = require('codemirror'),
    geojsonhint = require('geojsonhint'),
    widgets = [];

require('./lib/javascript.js')(CodeMirror);

var editor = CodeMirror(document.getElementById('cm'), {
    mode: 'application/json',
    matchBrackets: true,
    tabSize: 2,
    smartIndent: true
});

editor.setOption('theme', 'mistakes');

editor.on('change', validate);

editor.setValue(JSON.stringify({
    type: 'Point',
    coordinates: [0, 0]
}, null, 2));

function validate() {
    widgets.forEach(function(widget) {
        widget.clear();
    });
    var errors = geojsonhint.hint(editor.getValue());
    widgets = errors.map(function(error) {
        return editor.addLineWidget(error.line + 1, makeMarker(error.message));
    });
}

function makeMarker(msg) {
    var d = document.createElement('div');
    d.className = 'note warning';
    d.innerHTML = msg;
    return d;
}
