/*
 * Middleware matching .tmpl files for
 * precompiling underscore templates.
 */

var _ = require("underscore"),
    uglifyJS = require("uglify-js"),
    fss = require("../lib/fss"),
    use = require("../lib/use");

/*
 * Mime type.
 */
use('mime', 'tmpl', function() {
    return 'application/javascript';
});

/*
 * HTML tag.
 */
use('tag', 'tmpl', function(path) {
    return '<script src="' + path + '"></script>';
});

/*
 * Compile.
 */
use('compile', 'tmpl', function(file) {
    var pre = 'window.templates = window.templates || {}; ';
    var ns  = 'window.templates["' + fss.relative(file) + '"] = ';
    var src = _.template(fss.readFile(file)).source;
    var res = pre + ns + src + ';';
    return res;
});

/*
 * Minify.
 */
use('pack', 'tmpl', function(files) {
    var content = _.map(files, use('compile', 'tmpl')).join("");
    return uglifyJS.minify(content, { fromString: true }).code;
});