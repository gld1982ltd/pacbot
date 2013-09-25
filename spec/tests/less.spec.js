var pacbot = require('../../lib/pacbot');
var fss = require('../../lib/fss');

var contains = function (test, supstr, substr) {
    test.ok(supstr.indexOf(substr) === 0);
};

exports.canCompileLessCSS = function (test) {
    pacbot.config({
        config: 'spec/cases/less/pacbot.js',
        appdir: 'spec/cases/less',
        pubdir: 'spec/out/less'
    });
    pacbot.build(function () {
        var html = 'spec/out/less/index.html';
        var less = 'spec/out/less/assets/packed/common.css';
        test.ok(fss.exists(html));
        test.ok(fss.exists(less));
        contains(test, fss.readFile(html), '<link rel="stylesheet" href="/assets/packed/common.css?v=');
        test.equal(fss.readFile(less), '*{color:#f00}\n');
        test.done();
    });
};
