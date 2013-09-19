exports.config = function(pacbot) {

    pacbot.filter.set('target', 'html', function(file) {
        return file.replace(/\.html$/, '');
    });

    return {};
};
