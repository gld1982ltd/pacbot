var _ = require('underscore'),
    fs = require('fs'),
    path = require('path'),
    shell = require('shelljs'),
    config = require('../lib/config'),
    fss = exports;

/*
 * Reset a directory by deleting in and recreating it.
 */
fss.resetDir = function (dir) {
    if (fss.directoryExists(dir)) {
        shell.rm('-r', dir);
        shell.mkdir('-p', dir);
    }
};

/*
 * Get the directory of a file path.
 */
fss.directory = function (f) {
    return _.initial(f.split('/')).join('/');
};

/*
 * Get the filetype of a file path.
 */
fss.filetype = function (f) {
    return f.indexOf('.') === -1 ? 'html' : _.last(f.split('.'));
};

/*
 * Get the filename of a file path.
 */
fss.filename = function (f) {
    return _.last(f.split('/'));
};

/*
 * Read the data from a path to a string.
 */
fss.readFile = function (f) {
    var data = fs.readFileSync(f);
    return data.toString();
};

/*
 * Copy a file.
 */
fss.copy = function (from, to) {
    shell.mkdir('-p', fss.directory(to));
    shell.cp('-r', from, fss.directory(to));
};

/*
 * Copy an entire directory.
 */
fss.copyDir = function (from, to) {
    if (!fs.lstatSync(from).isDirectory()) throw('Not a directory');
    shell.cp('-r', from, to);
};

/*
 * Write data to a target file.
 */
fss.writeFile = function (to, data) {
    if (fss.isIgnoredFile(to)) return;
    shell.mkdir('-p', fss.directory(to));
    fs.writeFileSync(to, data);
};

/*
 * Read and concatenate content from an array of file paths.
 */
fss.readAllFiles = function (all) {
    return _.map(all, function (f) {
        if (fs.lstatSync(f).isDirectory()) {
            return '';
        } else {
            return fss.readFile(f);
        }
    }).join('\n');
};

/*
 * Get an array of all file paths from a source dir, recursively.
 */
fss.allSourceFilePaths = function (dir) {
    return _.chain(fss.all(dir)).map(function (f) {
        return dir + '/' + f;
    }).filter(fss.exists).value();
};

/*
 * Get an array of all file paths from a target dir, recursively.
 */
fss.allTargetFilePaths = function (dir) {
    return _.chain(fss.all(dir)).map(function (f) {
        return dir + '/' + f;
    }).filter(fss.exists).value();
};

/*
 * Check if a file exists at a path.
 */
fss.exists = function (f) {
    return fs.existsSync(f) && !fs.lstatSync(f).isDirectory();
};

/*
 * Check if a directory exists at a path.
 */
fss.directoryExists = function (f) {
    return fs.existsSync(f) && fs.lstatSync(f).isDirectory();
};

/*
 * Get all files from a directory.
 */
fss.all = function (dir, callback) {
    var files = shell.ls('-RA', dir);
    if (!_.isArray(files)) files = [];
    if (_.isFunction(callback)) callback(files);
    return files;
};

/*
 * Check if a path is a helper file or directory.
 */
fss.isHelperFile = function (f) {
    return fss.relative(f)[0] === '_';
};

/*
 * Check if a file should be processed.
 */
fss.isProcessableFile = function (f) {
    f = fss.source(f);
    return !fs.lstatSync(f).isDirectory() && !fss.isPublicFile(f);
};

/*
 * Check if a file is in the target directory.
 */
fss.isPublicFile = function (f) {
    return path.resolve(f).indexOf(config.pubdir) === 0;
};

/*
 * Check if the file at f is a dotfile.
 */
fss.isDotFile = function (f) {
    return fss.filename(f).charAt(0) === '.';
};

/*
 * Check if a file is an OS helper file.
 */
fss.isOSFile = function(f) {
    var name = fss.filename(f);
    return _.contains(['.DS_Store', 'Thumbs.db'], name);
};

/*
 * Check if a file should be ignored completely.
 */
fss.isIgnoredFile = function (f) {
    return _.filter(config.getIgnored(), function (i) {
        return fss.relative(f).indexOf(i) !== -1;
    }).length > 0;
};

/*
 * Get the target path from a relative path.
 */
fss.target = function (f) {
    return path.join(config.pubdir, f.replace(config.appdir, ''));
};

/*
 * Get the source path from a relative path.
 */
fss.source = function (f) {
    if (f.indexOf(config.appdir) === 0) return f;
    return path.join(config.appdir, f);
};

/*
 * Turn a path relative, to either the source directory or target directory.
 */
fss.relative = function (f) {
    if (f.indexOf(config.appdir) === 0) f = f.replace(config.appdir, '');
    if (f.indexOf(config.pubdir) === 0) f = f.replace(config.pubdir, '');
    return f.replace(/^\//, '');
};

/*
 * Turn a path relative to the projects base directory.
 */
fss.baseRelative = function (f) {
    if (f.indexOf(config.pwd) === 0) f = f.replace(config.pwd, '');
    return f.replace(/^\//, '');
};

/*
 * Make sure a path has a trailing slash.
 */
fss.slashify = function (f) {
    return f.replace(/\/$/, '') + '/';
};
