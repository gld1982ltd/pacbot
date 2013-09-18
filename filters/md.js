var marked = require('marked'),
    config = require('../lib/config'),
    fss = require('../lib/fss'),
    filter = require('../lib/filter');

/*
 * Mime type.
 */
filter('mime', 'md', function () {
    return 'text/html';
});

/*
 * Compile.
 */
filter('compile', 'md', function (file) {
    if (config.marked) marked.setOptions(config.marked);
    return marked(fss.readFile(file));
});

/*
 * Target file name.
 */
filter('target', 'md', function (file) {
    return file.replace(/\.md$/, '.html');
});
