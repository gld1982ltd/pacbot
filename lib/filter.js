/*
 * Filter state.
 */
var filters = {};

/*
 * Add filter of a type on a certain filetype.
 */
exports.set = function (type, filetype, handler) {
    filters[type] = filters[type] || {};
    filters[type][filetype] = handler;
};

/*
 * Get filter of a type matching a filetype.
 */
exports.get = function (type, filetype) {
    if (filters[type] && filters[type][filetype]) {
        return filters[type][filetype];
    } else {
        return function() {};
    }
};

/*
 * Check if a type of filter exists for a filetype.
 */
exports.has = function (type, filetype) {
    return filters[type] && filters[type][filetype];
};
