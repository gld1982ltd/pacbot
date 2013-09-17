var config = require('../../lib/config');
var pacbot = require('../../lib/pacbot');
var fss = require('../../lib/fss');

exports.setUp = function (callback) {
    fss.resetDir(config.pubdir);
    callback();
};

exports.canCompileMarkdown = function (test) {
    config.init({
        appdir: 'spec/cases/markdown',
        pubdir: 'spec/out/markdown'
    });
    pacbot.build(function () {
        test.ok(fss.exists('spec/out/markdown/one.html'));
        test.ok(fss.exists('spec/out/markdown/two.html'));

        var f1 = fss.readFile('spec/out/markdown/one.html');
        var fi = fss.readFile('spec/out/markdown/index.html');

        test.equal(f1, '<p><em>1</em>\n<strong>2</strong></p>\n');
        test.equal(fi, '<div><p><em>2</em></p>\n</div>');
        test.done();
    });
};
