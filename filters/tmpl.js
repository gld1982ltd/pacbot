var _ = require('underscore'),
    uglifyJS = require('uglify-js'),
    fss = require('../lib/fss'),
    filter = require('../lib/filter');

/*
 * Mime type.
 */
filter('mime', 'tmpl', function () {
    return 'text/javascript';
});

/*
 * HTML tag.
 */
filter('tag', 'tmpl', function (path) {
    return '<script src="' + path + '"></script>';
});

/*
 * Compile.
 */
filter('compile', 'tmpl', function (file) {
    var pre = 'window.templates = window.templates || {}; ';
    var ns  = 'window.templates["' + fss.relative(file) + '"] = ';
    var src = _.template(fss.readFile(file)).source;
    var res = pre + ns + src + ';';
    return res;
});

/*
 * Minify.
 */
filter('pack', 'tmpl', function (files) {
    var content = _.map(files, filter('compile', 'tmpl')).join("");
    return uglifyJS.minify(content, { fromString: true }).code;
});
