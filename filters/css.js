var _ = require('underscore'),
    cleanCSS = require('clean-css'),
    fss = require('../lib/fss'),
    filter = require('../lib/filter');

/*
 * Mime type.
 */
filter.set('mime', 'css', function () {
    return 'text/css';
});

/*
 * HTML tag.
 */
filter.set('tag', 'css', function (path) {
    return '<link rel="stylesheet" href="' + path + '">';
});

/*
 * Minify.
 */
filter.set('pack', 'css', function (files, callback) {
    var content = fss.readAllFiles(files);
    var minified = cleanCSS.process(content);
    callback(minified);
});
