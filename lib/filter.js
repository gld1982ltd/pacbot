var filter = exports;
var filters = {};

/*
 * Add filter of a type on a certain filetype.
 */
filter.set = function (type, filetype, handler) {
    filters[type] = filters[type] || {};
    filters[type][filetype] = handler;
};

/*
 * Get filter of a type matching a filetype.
 */
filter.get = function (type, filetype) {
    if (filters[type] && filters[type][filetype]) {
        return filters[type][filetype];
    } else {
        return function() {};
    }
};

/*
 * Check if a type of filter exists for a filetype.
 */
filter.has = function (type, filetype) {
    return filters[type] && filters[type][filetype];
};

/*
 * Remove a filter.
 */
filter.remove = function(type, filetype) {
    if (filters[type] && filters[type][filetype]) {
        delete filters[type][filetype];
    }
};
