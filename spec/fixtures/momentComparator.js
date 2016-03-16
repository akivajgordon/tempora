/*jslint es6, node: true */

(function () {
    "use strict";

    module.exports = {
        eq: (l, r) => l.isSame(r),
        lt: (l, r) => l.isBefore(r)
    };
}());
