var _ = require('underscore'),
    uglifyJS = require('uglify-js'),
    fss = require('../lib/fss'),
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
filter.set('pack', 'js', function (files) {
    return uglifyJS.minify(fss.readAllFiles(files), { fromString: true }).code;
});
