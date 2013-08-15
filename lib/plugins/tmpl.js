var _     = require("underscore"),
    fss   = require("../fss");

var compile = function(file) {
  return 'window.templates = window.templates || {}; window.templates["' + fss.relative(file) + '"] = ' + _.template(fss.readFile(file)).source;
};

/*
 * The function to process any template file,
 * exposed by this plugin.
 */
exports.process = function(f, data, locals) {
	return {
		'type' : 'application/javascript',
		'data' : compile(f)
	};
};
exports.compile = function(f) {
	return compile(f);
};