var pacbot = require('../../lib/pacbot');
var fss = require('../../lib/fss');

exports.setUp = function (callback) {
    pacbot.config({
        appdir: 'spec/cases/html',
        pubdir: 'spec/out/html',
        layout: false
    });
    callback();
};

var f1 = 'spec/out/html/1.html';
var f2 = 'spec/out/html/2.html';

exports.canIgnoreFilesInDev = function (test) {
    pacbot.config({
        dev: true,
        build: false,
        ignore_build: ['1.html'],
        ignore_dev: ['2.html']
    });
    pacbot.build(function() {
        test.ok( fss.exists(f1));
        test.ok(!fss.exists(f2));
        test.done();
    });
};

exports.canIgnoreFilesInBuild = function (test) {
    pacbot.config({
        dev: false,
        build: true,
        ignore_build: ['1.html'],
        ignore_dev: ['2.html']
    });
    pacbot.build(function() {
        test.ok(!fss.exists(f1));
        test.ok( fss.exists(f2));
        test.done();
    });
};

exports.canIgnoreNothing = function (test) {
    pacbot.config({
        dev: false,
        build: true,
        ignore_build: [],
        ignore_dev: []
    });
    pacbot.build(function() {
        test.ok(fss.exists(f1));
        test.ok(fss.exists(f2));
        test.done();
    });
};
