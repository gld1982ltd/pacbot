/*
 * This is an example of a config file.
 *
 * Run "pacbot -d" in this folder to view the example
 * site in dev mode in your browser, or build an
 * uploadable dir by running "pacbot -b".
 */
exports.config = function() {

    // Create a new config object.
    var config = {
        port: 1234,
        assets: {}
    };

    // Assets are specified by type, in groups,
    // and can be arrays of files or folders.
    // The assets are included in the layout file.
    config.assets.less = {
        all: [
            'assets/css/reset.less',
            'assets/css/base.less'
        ]
    };

    // Asset groups can also be just folders or a file.
    // Use folders if the inclusion order is arbitrary.
    config.assets.js = {
        all: 'assets/js'
    };

    // You can also precompile templates, for example
    // using Underscore's _.template function.
    config.assets.tmpl = {
        all: 'assets/templates'
    };

    // You can also generate appcache manifests, just
    // remember to reference the file from your <html> tag.
    config.assets.cache = {
        'cache.appcache': [
            'assets/packed',
            'assets/images'
        ]
    };

    // Add some options for UglifyJS.
    config.uglifyjs = {
        output: { comments: /^!|@preserve|@license|@cc_on/i }
    };

    // Return the config object.
    return config;

};
