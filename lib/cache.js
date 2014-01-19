var _ = require('underscore'),
    path = require('path'),
    config = require('../lib/config'),
    filter = require('../lib/filter'),
    log = require('../lib/log'),
    fss = require('../lib/fss');

/*
 * Cache manifest constants
 */
var header    = 'CACHE MANIFEST';
var section   = 'CACHE:';
var network   = '\nNETWORK:\n*\nhttp://*\nhttps://*\n';
var settings  = 'SETTINGS:\nprefer-online\n';

/*
 * Get the complete path for a cached file.
 * Generated files need the same timestamp as their HTML tags.
 */
var pathSuffix = function(file) {
    var mime   = filter.get('mime', fss.filetype(file))();
    var busted = mime && mime !== 'text/html';
    var prefix = config.root ? config.root : '';
    var suffix = config.timestamp && busted ? '?v=' + config.time : '';
    return path.join(prefix, fss.relative(file)) + suffix;
};

/*
 * Generate a list of all files that should be cached.
 */
var cacheFiles = function (files) {
    if (!_.isArray(files)) files = [files];
    return _.chain(files).map(fss.target).map(function (f) {
        if (!fss.directoryExists(f)) return f;
        return fss.allTargetFilePaths(f);
    }).flatten().uniq().map(pathSuffix).value();
};

/*
 * Write manifest file with a list of files.
 */
var writeCacheManifest = function(target, filelist) {
    var buster = config.timestamp ? '# Time: ' + (new Date()) + '\n' : '';
    var content = [header, buster, section, filelist, network, settings];
    fss.writeFile(target, content.join('\n'));
};

/*
 * Create an Appcache file from generated files in build mode.
 */
exports.build = function() {
    if (!config.assets.cache) return;
    _.each(config.assets.cache, function(files, name) {
        var target = fss.target(name);
        var cached = cacheFiles(files);
        log('appcache', cached.length, 'files in', fss.baseRelative(target));
        writeCacheManifest(target, cached.join('\n'));
    });
};
