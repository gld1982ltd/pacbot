exports.config = function(pacbot) {

    var config = {
        assets: {}
    };

    config.assets.cache = {
        'cache.appcache': [
            'css',
            'img/a',
            'img/1.png',
            'img',
            '/html/',
            'js/'
        ]
    };

    return config;

};
