var pacbot = require('../../lib/pacbot');
var fss = require('../../lib/fss');

exports.tearDown = function (callback) {
    pacbot.filter.remove('target', 'html');
    callback();
};

exports.canAddCustomFilters = function (test) {
    pacbot.config({
        appdir: 'spec/cases/filters',
        pubdir: 'spec/out/filters',
        config: 'spec/cases/filters/pacbot.js'
    });
    pacbot.build();
    test.ok(!fss.exists('spec/out/filters/index.html'));
    test.equal(fss.readFile('spec/out/filters/index'), 'hello\n');
    test.done();
};
