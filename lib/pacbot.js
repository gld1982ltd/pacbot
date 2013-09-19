var _ = require('underscore'),
    config = require('../lib/config'),
    log = require('../lib/log'),
    fss = require('../lib/fss'),
    sync = require('../lib/sync'),
    server = require('../lib/server'),
    filter = require('../lib/filter'),
    pacbot = exports;

/*
 * Current version.
 */
pacbot.version = '0.18.0';

/*
 * Default filters.
 */
require('../filters/md');
require('../filters/js');
require('../filters/css');
require('../filters/tmpl');
require('../filters/html');

/*
 * Initial logging.
 */
var preamble = function () {
    log();
    log('source', fss.baseRelative(config.source));
    log('target', fss.baseRelative(config.target));
    if (!fss.directoryExists(fss.baseRelative(config.appdir))) {
        log('error', 'no source directory at', config.appdir);
        process.exit(1);
    }
};

/*
 * Init with custom config flags.
 */
pacbot.init = function (custom) {
    return config.init(pacbot, custom);
};

/*
 * Set configuration flags.
 */
pacbot.config = function (custom) {
    return config.extend(custom || {}, pacbot);
};

/*
 * Expose filters API.
 */
pacbot.filter = filter;

/*
 * Start pacbot in dev mode.
 */
pacbot.dev = function () {
    preamble();
    server.dev();
};

/*
 * Start pacbot in build mode.
 */
pacbot.build = function (callback) {
    preamble();
    fss.resetDir(config.pubdir);
    fss.all(config.appdir, function (files) {
        _.each(files, pacbot.copy);
        log('completed', files.length, 'files');
        if (callback) callback();
    });
    log();
};

/*
 * Deploy files using rsync.
 */
pacbot.sync = function () {
    if (!config.build) log();
    sync.perform();
};

/*
 * Copy one file from the source dir to the target dir.
 */
pacbot.copy = function (file) {
    if (!fss.isProcessableFile(file)) return;
    if (fss.isHelperFile(file)) return;
    if (fss.isIgnoredFile(file)) return;

    var source = fss.source(file);
    var target = fss.target(source);
    var type = fss.filetype(source);
    var parsed = filter.get('target', type)(target) || target;

    // Copy plain files, compile special files.
    if (!filter.has('compile', type)) fss.copy(source, parsed);
    else fss.writeFile(parsed, pacbot.compile(source));
};

/*
 * Compile the content of a single file.
 */
pacbot.compile = function (file, vars) {
    var compiler = filter.get('compile', fss.filetype(file));
    return compiler(file, fss.readFile(file), vars || {});
};

/*
 * Initialize pacbot and config.
 */
pacbot.init();
