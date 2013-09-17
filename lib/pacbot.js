var _ = require("underscore"),
    config = require("../lib/config"),
    log = require("../lib/log"),
    fss = require("../lib/fss"),
    sync = require("../lib/sync"),
    server = require("../lib/server"),
    use = require("../lib/use");

/*
 * Current version.
 */
exports.version = "0.16.0";

/*
 * Add filters.
 */
require("../filters/js");
require("../filters/css");
require("../filters/tmpl");
require("../filters/html");

/*
 * Initial logging.
 */
var preamble = function() {
  log();
  log("source", fss.baseRelative(config.source));
  log("target", fss.baseRelative(config.target));
  if(!fss.directoryExists(fss.baseRelative(config.appdir))) {
    log("error", "no source directory at", config.appdir);
    process.exit(1);
  }
};

/*
 * Set configuration flags.
 */
exports.config = function(custom) {
  return config.extend(custom);
};

/*
 * Start pacbot in dev mode.
 */
exports.dev = function() {
  preamble();
  server.dev();
};

/*
 * Start pacbot in build mode.
 */
exports.build = function(callback) {
  preamble();
  fss.resetDir(config.pubdir);
  fss.all(config.appdir, function(files) {
    log("processing", files.length, "files");
    _.each(files, exports.generate);
    log("completed", files.length, "files");
    if(callback) callback();
  });
  log();
};

/*
 * Deploy files using rsync.
 */
exports.sync = function() {
  if(!config.build) log();
  sync.perform();
};

/*
 * Process one file from the source dir.
 */
exports.generate = function(file) {
  if(!fss.isProcessableFile(file)) return;
  if(fss.isHelperFile(file)) return;
  if(fss.isIgnoredFile(file)) return;

  var source = fss.source(file);
  var target = fss.target(source);
  var type = fss.filetype(source);

  if(_.isFunction(config.filename) && config.needsProcessing(source)) {
    target = config.filename(target);
  }

  if(use.has('compile', type)) {
    fss.writeFile(target, exports.process(source));
  } else {
    fss.copy(source, target);
  }
};

/*
 * Process the content of a single file.
 */
exports.process = function(f, locals) {
  var data = fss.readFile(f);
  var type = fss.filetype(f);
  return use('compile', type)(f, data, locals || {});
};
