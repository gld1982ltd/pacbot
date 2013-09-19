var pacbot = require('../../lib/pacbot');
var fss = require('../../lib/fss');

var testContent = function (test, expected, path) {
    pacbot.build();
    test.equal(fss.readFile(path || 'spec/out/layouts/index.html'), expected);
};

exports.setUp = function (callback) {
    pacbot.init();
    callback();
};

exports.canUseDefaultLayout = function (test) {
    pacbot.config({
        appdir: 'spec/cases/layouts',
        pubdir: 'spec/out/layouts'
    });
    testContent(test, 'd c d');
    test.done();
};

exports.canSkipLayout = function (test) {
    pacbot.config({
        appdir: 'spec/cases/layouts',
        pubdir: 'spec/out/layouts',
        layout: false
    });
    testContent(test, 'c');
    test.done();
};

exports.canUseCustomLayoutPath = function (test) {
    var config = pacbot.config({
        appdir: 'spec/cases/layouts',
        pubdir: 'spec/out/layouts',
        layout: '_ls/1.html'
    });
    testContent(test, '1 c 1');
    config.layout = '_ls/2.html';
    testContent(test, '2 c 2');
    test.done();
};

exports.canUseMultipleLayouts = function (test) {
    pacbot.config({
        appdir: 'spec/cases/layouts',
        pubdir: 'spec/out/layouts',
        layouts: { 'index2.html': '_layouts/other.html' }
    });
    testContent(test, 'd c d', 'spec/out/layouts/index.html');
    testContent(test, 'o o o', 'spec/out/layouts/index2.html');
    test.done();
};
