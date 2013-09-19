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
    config.assets.css = {
        all: [
            'assets/css/reset.css',
            'assets/css/base.css',
        ]
    };

    // Asset groups can also be just folders or a file.
    // or just a single file, if the order is arbitrary.
    config.assets.js = {
        all: 'assets/js'
    };

    // Return the config object.
    return config;

};