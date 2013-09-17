var _ = require("underscore"),
    uglifyJS = require("uglify-js"),
    fss = require("../lib/fss"),
    use = require("../lib/use");

/*
 * Mime type.
 */
use('mime', 'js', function() {
    return 'text/javascript';
});

/*
 * HTML tag.
 */
use('tag', 'js', function(path) {
    return '<script src="' + path + '"></script>';
});

/*
 * Minify.
 */
use('pack', 'js', function(files) {
    return uglifyJS.minify(fss.readAllFiles(files), { fromString: true }).code;
});