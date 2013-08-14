var _     = require("underscore"),
    fss   = require("../fss");

var compile = function(f) {
  return 'templates = templates || {}; templates["' + f + '"] = ' + _.template(fss.readFile(f)).source;
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
}
exports.compile = function(f) {
	return compile(f);
}