/*jslint es6, node: true */

(function () {
    "use strict";

    module.exports = {
        eq: (l, r) => l === r,
        lt: function (l, r) {
            const sizes = ['xs', 's', 'm', 'l', 'xl'];

            return sizes.indexOf(l) < sizes.indexOf(r);
        }
    };
}());
