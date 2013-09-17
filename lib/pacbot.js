var _ = require("underscore"),
    config = require("../lib/config"),
    log = require("../lib/log"),
    fss = require("../lib/fss"),
    sync = require("../lib/sync"),
    server = require("../lib/server"),
    html = require("../lib/html"),
    use = require("../lib/use");

/*
 * Current version.
 */
exports.version = "0.16.0";

/*
 * Add middleware.
 */
require("../middleware/js");
require("../middleware/css");
require("../middleware/tmpl");

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
 * Regenerate one file from the source directory to the target directory.
 */
exports.generate = function(file) {
  if(!fss.isProcessableFile(file) || fss.isHelperFile(file)) return;
  if(fss.isIgnoredFile(file)) return;

  var source = fss.source(file);
  var target = fss.target(source);
  var type = fss.filetype(source);

  if(_.isFunction(config.filename) && config.needsProcessing(source)) {
    target = config.filename(target);
  }

  if(type === 'html' || use.has('compile', type)) {
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
  if (type === 'html') return html.process(f, data, locals || {});
  return use('compile', type)(f);
};
