var _ = require('underscore'),
    fs = require('fs'),
    path = require('path'),
    config = require('../lib/config'),
    log = require('../lib/log'),
    fss = require('../lib/fss'),
    filter = require('../lib/filter');

/*
 * A cache of already concatenated and minified assets.
 */
var assetCache = {};

/*
 * Check if asset files have the correct file extension.
 */
var assetFileTypeMismatch = function (type, f) {
    return type !== _.last(f.split('.'));
};

/*
 * Decide the HTML based on asset type and path.
 */
var toHtml = function (type, path) {
    var version = config.timestamp && config.build ? '?v=' + config.time : '';
    return filter.get('tag', type)(path + version) || '';
};

/*
 * Get all asset files by type and group from the config file.
 */
var assetFiles = function (type, group) {
    if (!config.assets) throw('No assets found in config');
    var t = config.assets[type];
    if (!t) throw('Asset type not found: ' + type);
    var g = t[group];
    if (!g) throw('Asset group not found: ' + group);

    if (!_.isArray(g)) g = [g];
    return _.chain(g).map(function (f) {
        return fss.source(f);
    }).map(function (f) {
        if (fs.lstatSync(f).isDirectory()) return fss.allSourceFilePaths(f);
        return f;
    }).flatten().uniq().filter(function (f) {
        var process = fss.isProcessableFile(f);
        var include = !fss.isHelperFile(_.last(f.split('/')));
        return process && include && !assetFileTypeMismatch(type, f);
    }).value();
};

/*
 * Serve assets in dev mode, by serving the files as they are.
 */
var dev = function (type, group) {
    return _.map(assetFiles(type, group), function (file) {
        return toHtml(type, path.join(config.root, fss.relative(file)));
    }).join('\n');
};

/*
 * Serve assets in build mode, by concatenating and miniying resources.
 */
var build = function (type, group) {
    var name = path.join(config.packed, group + '.' + type);
    var parsed = filter.get('target', type)(name) || name;
    var target = fss.target(parsed);

    if (!fss.exists(target) || !assetCache[target]) {
        log('packing', fss.baseRelative(target));
        var files = assetFiles(type, group);
        if (_.isArray(files) && files.length > 0) {
            var html = toHtml(type, path.join(config.root, parsed));
            filter.get('pack', type)(files, function(packed) {
                if (packed) fss.writeFile(target, packed);
                if (html) assetCache[target] = html;
            });
        }
    }

    return assetCache[target] || '';
};

/*
 * Export the asset method used by templates.
 */
module.exports = function (assetType, assetGroup) {
    return config.dev ?
        dev(assetType, assetGroup) :
        build(assetType, assetGroup);
};
