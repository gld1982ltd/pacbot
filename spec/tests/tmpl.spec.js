var pacbot = require('../../lib/pacbot');
var fss = require('../../lib/fss');

exports.setUp = function (callback) {
    pacbot.config({
        appdir: 'spec/cases/tmpl',
        pubdir: 'spec/out/tmpl',
        packed: 'assets',
        config: 'spec/cases/tmpl/config.js'
    });
    callback();
};

var js = function (path) {
    return '<script src="' + path;
};

var assertSubstr = function (test, supstr, substr) {
    test.ok(supstr.indexOf(substr) > -1);
};

exports.canCompileAssetTemplates = function (test) {
    pacbot.build(function () {
        test.ok(fss.exists('spec/out/tmpl/index.html'));
        assertSubstr(test, fss.readFile('spec/out/tmpl/index.html'),  js('/assets/common.tmpl'));
        assertSubstr(test, fss.readFile('spec/out/tmpl/assets/common.tmpl'),  'window.templates["assets/templates/1.tmpl"]');
        test.done();
    });
};
