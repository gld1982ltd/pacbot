exports.config = function(pacbot) {

    var config = {
        assets: {}
    };

    config.assets.cache = {
        'cache.appcache': [
            'css/1.css',
            'img/a',
            'img',
            '/html/',
            'js/'
        ]
    };

    return config;

};
