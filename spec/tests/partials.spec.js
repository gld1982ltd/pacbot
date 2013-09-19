var pacbot = require('../../lib/pacbot');
var fss = require('../../lib/fss');

exports.setUp = function (callback) {
    pacbot.init();
    callback();
};

exports.partialsAreInCorrectOrder = function (test) {
    pacbot.config({
        appdir: 'spec/cases/part',
        pubdir: 'spec/out/part'
    });
    pacbot.build(function () {
        test.equal('1 2 3 4 5 6 7', fss.readFile('spec/out/part/index.html'));
        test.done();
    });
};

exports.partialsCanSetVars = function (test) {
    pacbot.config({
        appdir: 'spec/cases/vars',
        pubdir: 'spec/out/vars'
    });
    pacbot.build(function () {
        test.equal('1 a pa 1', fss.readFile('spec/out/vars/a.html'));
        test.equal('2 b pb 2', fss.readFile('spec/out/vars/b.html'));
        test.equal('3 c 3',    fss.readFile('spec/out/vars/c.html'));
        test.done();
    });
};
