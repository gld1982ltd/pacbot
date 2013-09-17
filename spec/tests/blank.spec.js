var config = require('../../lib/config');
var pacbot = require('../../lib/pacbot');
var fss = require('../../lib/fss');

exports.setUp = function (callback) {
    fss.resetDir(config.pubdir);
    callback();
};

var testContent = function (test, expected, path) {
    pacbot.build();
    test.equal(fss.readFile(path || 'spec/out/blank/index.html'), expected);
};

exports.canBuildBlankProject = function (test) {
    config.init({
        appdir: 'spec/cases/blank',
        pubdir: 'spec/out/blank'
    });
    testContent(test, 'hello');
    test.done();
};
