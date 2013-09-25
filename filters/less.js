var less = require('less'),
    fss = require('../lib/fss'),
    log = require('../lib/log'),
    filter = require('../lib/filter');

/*
 * Mime type.
 */
filter.set('mime', 'less', function () {
    return 'text/css';
});

/*
 * HTML tag.
 */
filter.set('tag', 'less', function (path) {
    return '<link rel="stylesheet" href="' + path + '">';
});

/*
 * Compile.
 */
filter.set('compile', 'less', function (file, data, locals, callback) {
    less.render(fss.readFile(file), function (err, css) {
        if (err) log('error', 'could not render less file', file);
        if (err) throw(err);
        callback(css);
    });
});

/*
 * Minify.
 */
filter.set('pack', 'less', function (files, callback) {
    var parser = new(less.Parser)();
    var content = fss.readAllFiles(files);
    parser.parse(content, function (err, tree) {
        if (err) log('error', 'could not render less files');
        if (err) throw(err);
        callback(tree.toCSS({ compress: true }));
    });
});

/*
 * Target file name.
 */
filter.set('target', 'less', function (file) {
    return file.replace(/\.less$/, '.css');
});
