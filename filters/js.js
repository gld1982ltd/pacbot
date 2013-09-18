var _ = require('underscore'),
    uglifyJS = require('uglify-js'),
    fss = require('../lib/fss'),
    filter = require('../lib/filter');

/*
 * Mime type.
 */
filter('mime', 'js', function () {
    return 'text/javascript';
});

/*
 * HTML tag.
 */
filter('tag', 'js', function (path) {
    return '<script src="' + path + '"></script>';
});

/*
 * Minify.
 */
filter('pack', 'js', function (files) {
    return uglifyJS.minify(fss.readAllFiles(files), { fromString: true }).code;
});
