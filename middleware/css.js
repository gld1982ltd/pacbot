/*
 * Middleware matching .css files for
 * specific CSS functionality.
 */

var _ = require("underscore"),
    cleanCSS = require("clean-css"),
    fss = require("../lib/fss"),
    use = require("../lib/use");

/*
 * Mime type.
 */
use('mime', 'css', function() {
    return 'text/css';
});

/*
 * HTML tag.
 */
use('tag', 'css', function(path) {
    return '<link rel="stylesheet" href="' + path + '">';
});

/*
 * Minify.
 */
use('pack', 'css', function(files) {
    return cleanCSS.process(fss.readAllFiles(files));
});