var pacbot = require('../../lib/pacbot');
var fss = require('../../lib/fss');

var contains = function (test, supstr, substr) {
    test.ok(supstr.indexOf(substr) > -1);
};

exports.setUp = function (callback) {
    pacbot.config({
        appdir: 'spec/cases/cache/content',
        pubdir: 'spec/out/cache',
        config: 'spec/cases/cache/pacbot.js'
    });
    callback();
};

exports.canCreateAppCacheFile = function (test) {
    pacbot.build(function () {
        var content = fss.readFile('spec/out/cache/cache.appcache');
        contains(test, content, 'CACHE MANIFEST\n');
        contains(test, content, '\nprefer-online');
        contains(test, content, '\nimg/1.png#');
        contains(test, content, '\nimg/a/2.png#');
        contains(test, content, '\nimg/a/3.png#');
        contains(test, content, '\nimg/b/4.png#');
        contains(test, content, '\ncss/1.css#');
        test.done();
    });
};
