var pacbot = require('../../lib/pacbot');
var fss = require('../../lib/fss');

var contains = function (test, supstr, substr) {
    test.ok(supstr.indexOf(substr) > -1);
};

exports.canCreateAppCacheFile = function (test) {
    pacbot.config({
        appdir: 'spec/cases/cache/content',
        pubdir: 'spec/out/cache',
        config: 'spec/cases/cache/pacbot.js'
    });
    pacbot.build(function () {
        var content = fss.readFile('spec/out/cache/cache.appcache');
        contains(test, content, 'CACHE MANIFEST\n');
        contains(test, content, '\n\nCACHE:\n');
        contains(test, content, '\n\nNETWORK:\n*\n');
        contains(test, content, '\n/img/1.png#v=');
        contains(test, content, '\n/img/a/2.png#v=');
        contains(test, content, '\n/img/a/3.png#v=');
        contains(test, content, '\n/img/b/4.png#v=');
        contains(test, content, '\n/css/1.css#v=');
        contains(test, content, '\nprefer-online');
        test.done();
    });
};

exports.canHonorRootPrefix = function (test) {
    pacbot.config({
        appdir: 'spec/cases/cache/content',
        pubdir: 'spec/out/cache',
        config: 'spec/cases/cache/pacbot.js',
        root: 'foo/bar/'
    });
    pacbot.build(function () {
        var content = fss.readFile('spec/out/cache/cache.appcache');
        contains(test, content, 'CACHE MANIFEST\n');
        contains(test, content, '\nfoo/bar/img/1.png#v=');
        contains(test, content, '\nfoo/bar/img/a/2.png#v=');
        contains(test, content, '\nfoo/bar/css/1.css#v=');
        test.done();
    });
};