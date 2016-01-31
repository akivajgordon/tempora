/*jslint es6, node: true */

(function () {
    "use strict";

    module.exports = function (spec) {
        const
            lo = Math.min(spec.lo, spec.hi !== undefined
                ? spec.hi
                : spec.lo),
            hi = Math.max(spec.hi, spec.lo !== undefined
                ? spec.lo
                : spec.hi);

        return Object.freeze({lo, hi});
    };
}());
