var pacbot = require('../../lib/pacbot');
var fss = require('../../lib/fss');

var contains = function (test, supstr, substr) {
    test.ok(supstr.indexOf(substr) > -1);
};

exports.canCreateAppCacheFile = function (test) {
    pacbot.config({
        appdir: 'spec/cases/cache/content',
        pubdir: 'spec/out/cache',
        config: 'spec/cases/cache/pacbot.js',
        timestamp: false
    });
    pacbot.build(function () {
        var content = fss.readFile('spec/out/cache/cache.appcache');
        var solution = fss.readFile('spec/out/cache/solution.appcache');
        test.equal(content, solution);
        test.done();
    });
};

exports.canHonorRootAndTimestamp = function (test) {
    pacbot.config({
        appdir: 'spec/cases/cache/content',
        pubdir: 'spec/out/cache',
        config: 'spec/cases/cache/pacbot.js',
        root: 'foo/bar/',
        timestamp: true
    });
    pacbot.build(function () {
        var content = fss.readFile('spec/out/cache/cache.appcache');
        contains(test, content, 'CACHE MANIFEST\n# Time: ');
        contains(test, content, '\nfoo/bar/img/1.png\n');
        contains(test, content, '\nfoo/bar/img/a/2.png\n');
        contains(test, content, '\nfoo/bar/css/1.css?v=');
        test.done();
    });
};