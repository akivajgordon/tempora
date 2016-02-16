/*jslint es6, node: true */

(function () {
    "use strict";

    module.exports = function (spec) {
        const
            lo = Math.min(spec.lo !== undefined
                ? spec.lo
                : spec.hi, spec.hi !== undefined
                ? spec.hi
                : spec.lo),
            hi = Math.max(spec.hi !== undefined
                ? spec.hi
                : spec.lo, spec.lo !== undefined
                ? spec.lo
                : spec.hi),

            overlaps = function (spec) {
                const interval = spec.interval;
                return hi > interval.lo && lo < interval.hi;
            };

        return Object.freeze({lo, hi, overlaps});
    };
}());
