var _ = require('underscore'),
    uglifyJS = require('uglify-js'),
    fss = require('../lib/fss'),
    log = require('../lib/log')
    filter = require('../lib/filter');

/*
 * Mime type.
 */
filter.set('mime', 'tmpl', function () {
    return 'text/javascript';
});

/*
 * HTML tag.
 */
filter.set('tag', 'tmpl', function (path) {
    return '<script src="' + path + '"></script>';
});

/*
 * Compile.
 */
filter.set('compile', 'tmpl', function (file) {
    var pre = 'window.templates = window.templates || {}; ';
    var ns  = 'window.templates["' + fss.relative(file) + '"] = ';
    try {
        var src = _.template(fss.readFile(file)).source;
    } catch(e) {
        throw('Compilation error in: ' + file);
    }
    var res = pre + ns + src + ';';
    return res;
});

/*
 * Minify.
 */
filter.set('pack', 'tmpl', function (files, callback) {
    var content = _.map(files, filter.get('compile', 'tmpl')).join("");
    var minified = uglifyJS.minify(content, { fromString: true }).code;
    callback(minified);
});
