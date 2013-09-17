var marked = require('marked'),
    config = require('../lib/config'),
    fss = require('../lib/fss'),
    use = require('../lib/use');

/*
 * Mime type.
 */
use('mime', 'md', function () {
    return 'text/plain';
});

/*
 * Compile.
 */
use('compile', 'md', function (file) {
    if (config.marked) marked.setOptions(config.marked);
    return marked(fss.readFile(file));
});

/*
 * Target file name.
 */
use('target', 'md', function (file) {
    return file.replace(/\.md$/, '.html');
});