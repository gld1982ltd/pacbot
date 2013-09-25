var _ = require('underscore'),
    path = require('path'),
    config = require('../lib/config'),
    pacbot = require('../lib/pacbot'),
    fss = require('../lib/fss'),
    log = require('../lib/log'),
    assets = require('../lib/assets'),
    filter = require('../lib/filter');

/*
 * A map of current template variables.
 */
var templateVars = {};

/*
 * A collection of helper functions for templates.
 */
var helpers = {};

/*
 * Process the current layout file.
 */
var processLayout = function (f, content) {
    var path = config.getLayout(f);
    if (!path) return content;
    if (!fss.exists(path)) return content;
    return compile(f, fss.readFile(path),
        _.extend(templateData({}), { content: content }));
};

/*
 * Compile a template with data.
 */
var compile = function (f, data, context) {
    try {
        return _.template(data)(context);
    } catch(e) {
        log('error', 'could not parse template file', f);
        throw(e);
    }
};

/*
 * Reset the current list of template variables,
 * they should not carry over between pages.
 */
var reset = function () {
    if (config.filters && config.filters.html && config.filters.html.vars) {
        templateVars = _.clone(config.filters.html.vars);
    } else {
        templateVars = {};
    }
};

/*
 * Return the current template data, with additional local vars.
 * The global config is also available to all templates.
 */
var templateData = function (locals) {
    return _.extend(helpers, config.helpers, locals, { config: config });
};

/*
 * Helper to render a partial.
 */
helpers.partial = function (f, locals) {
    locals = locals || {};
    locals.templateType = 'partial';
    var file = path.join(config.appdir, f);
    var result = pacbot.compile(file, locals);
    if (result) return result;
    return fss.readFile(file);
};

/*
 * Helper to get the value of a template variable,
 * with an optional default value.
 */
helpers.get = function (key, defaultValue) {
    return key in templateVars ? templateVars[key] : defaultValue;
};

/*
 * Helper to set a template variable.
 */
helpers.set = function (key, value) {
    templateVars[key] = value;
    return value;
};

/*
 * Helper to get the assets of a type and
 * group for the current mode.
 */
helpers.assets = function (type, group) {
    return assets(type, group);
};

/*
 * Helper for redirecting from one page to another.
 */
helpers.redirect = function (relative_target) {
    return '<meta http-equiv="refresh" content="0; url=' + relative_target + '">';
};

/*
 * Mime type.
 */
filter.set('mime', 'html', function () {
    return 'text/html';
});

/*
 * Compile.
 */
filter.set('compile', 'html', function (file, data, locals, callback) {
    var partial = locals.templateType === 'partial';
    var ignored = !config.needsProcessing(file);
    var tagged  = data.indexOf('<%') !== -1;

    if (!partial) {
        reset();
    }
    if (!ignored && tagged) {
        data = compile(file, data, templateData(locals));
    }
    if (partial || ignored) {
        return data;
    } else {
        return processLayout(file, data);
    }
    return result;
});
