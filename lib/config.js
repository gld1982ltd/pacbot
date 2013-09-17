var _ = require('underscore'),
    path = require('path'),
    fss = require('../lib/fss'),
    config = exports,
    fns = {};

/*
 * Default config.
 */
var defaults = {

    // The source directory
    source: 'content',

    // The target directory in build mode
    target: 'public',

    // Root path for generated absolute paths
    root: '/',

    // Path for packed assets (under config.root)
    packed: 'assets/packed/',

    // The config file
    config: 'pacbot.js',

    // Server post to use in dev mode
    port: 3000,

    // Turn logging off or on
    silent: true,

    // Add version timestamp to asset paths in build mode
    timestamp: true,

    // Default layout file for HTML files
    layout: '_layouts/default.html',

    // Other layouts for specific file paths
    layouts: {},

    // HTML helper functions
    helpers: {},

    // Specify a function to transform filenames in build mode.
    // The function should take a complete file path as its only argument,
    // and should return a changed (or the original) path.
    filename: false,

    // Specify asset groups
    assets: {},

    // Files which should always be ignored
    ignore: [],

    // Files which should be ignored in dev mode
    ignore_dev: [],

    // Files which should be ignored in build mode
    ignore_build: [],

    // Files which should not be processed as HTML
    ignore_processing: [],

    // The rsync command used for syncing files
    rsync: 'rsync -a --delete',

    // Remote server address
    remote: false,

    // Options for the Marked Markdown parser
    marked: {},

    // Underscore template settings
    templateSettings:  {
        evaluate:    /<%([\s\S]+?)%>/g,  // code <% ... %>
        interpolate: /<%=([\s\S]+?)%>/g, // echo, not escaped <%= ... %>
        escape:      /<%-([\s\S]+?)%>/g  // echo, escaped <%- ... %>
    }

};

/*
 * Extend the current config with custom flags.
 */
fns.extend = function (custom) {
    config = _.extend(config, custom);
    if (custom.config) config = _.extend(config, fns.load(fns.getPath()));
    return config;
};

/*
 * Get the absolute layout path from the current config.
 */
fns.getLayout = function (f) {
    if (!config.layout) return null;
    var match = _.chain(config.layouts).keys().filter(function (key) {
        return f.indexOf(key) !== -1;
    }).last().value();
    return path.join(config.appdir, match ? config.layouts[match] : config.layout);
};

/*
 * Get the config file path.
 */
fns.getPath = function () {
    var files = [config.config, 'pacman.js', 'config.js'];
    var file  = _.find(files, fss.exists);
    if (file) return path.join(config.pwd, file);
};

/*
 * Get a list of all ignored files.
 */
fns.getIgnored = function () {
    return config.dev ?
    _.union(config.ignore, config.ignore_dev) :
    _.union(config.ignore, config.ignore_build);
};

/*
 * Check if a file is ignored from processing.
 */
fns.needsProcessing = function (f) {
    return _.filter(config.ignore_processing, function (ignored) {
        return f.indexOf(ignored) !== -1;
    }).length === 0;
};

/*
 * Load a config file from a path.
 */
fns.load = function (f) {
    if (!fss.exists(f)) return {};
    return require(f).config;
};

/*
 * Initialize the default config with custom flags.
 */
fns.init = function (custom) {
    config.time = (new Date()).getTime();
    config = _.extend(config, defaults);
    config = _.extend(config, fns);

    config.pwd = process.cwd();
    config.appdir = path.join(config.pwd, config.source);
    config.pubdir = path.join(config.pwd, config.target);

    config = _.extend(config, custom);
    config = _.extend(config, fns.load(fns.getPath()));

    _.templateSettings = config.templateSettings;

    return config;
};

/*
 * Create the default config on first load.
 */
module.exports = fns.init();
