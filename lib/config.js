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

    //Preserver certain comments (license etc.). Possible values = true, false or regex
    preserveComments: null,

    // The rsync command used for syncing files
    rsync: 'rsync -a --delete',

    // Remote server address
    remote: false,

    // Options for UglifyJS
    uglifyjs: {},

    // Options for the Marked Markdown parser
    marked: {},

    // Underscore template settings
    templateSettings: false

};

/*
 * Extend the current config with custom flags.
 */
fns.extend = function (custom, pacbot) {
    config = _.extend(config, custom);
    if (custom.config) config = _.extend(config, fns.load(fns.getPath(), pacbot));
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
    var files = [config.config, 'pacbot.js', 'pacman.js', 'config.js'];
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
fns.load = function (f, pacbot) {
    if (!fss.exists(f)) return {};
    var mod = require(f);
    var cfg = _.isFunction(mod.config) ? mod.config(pacbot) : mod.config;
    return cfg || {};
};

/*
 * Initialize the default config with custom flags.
 */
config.init = function (pacbot, custom) {
    config.pwd = process.cwd();

    config.time = (new Date()).getTime();
    config = _.extend(config, defaults);
    config = _.extend(config, fns);
    config = _.extend(config, fns.load(fns.getPath(), pacbot));
    config = _.extend(config, custom || {});

    config.appdir = path.join(config.pwd, config.source);
    config.pubdir = path.join(config.pwd, config.target);
    _.templateSettings = config.templateSettings || _.templateSettings;

    return config;
};
