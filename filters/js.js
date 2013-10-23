var _ = require('underscore'),
    uglifyJS = require('uglify-js'),
    fss = require('../lib/fss'),
    config = require('../lib/config'),
    filter = require('../lib/filter');

/*
 * Mime type.
 */
filter.set('mime', 'js', function () {
    return 'text/javascript';
});

/*
 * HTML tag.
 */
filter.set('tag', 'js', function (path) {
    return '<script src="' + path + '"></script>';
});

/*
 * Minify.
 */
filter.set('pack', 'js', function (files, callback) {
    var content = fss.readAllFiles(files);
    var minified = uglifyJS.minify(content, { fromString: true, output: { comments: config.preserveComments }}).code;
    callback(minified);
});
