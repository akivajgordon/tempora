/*jslint es6, node: true */

(function () {
    "use strict";

    const simpleComparator = {
        eq: (l, r) => l === r,
        lt: (l, r) => l < r
    };

    const comparable = function (spec) {
        let comparator = Object.assign({}, spec.comparator);

        comparator.gt = (l, r) => !comparator.eq(l, r) && !comparator.lt(l, r);

        return Object.freeze(comparator);
    };

    module.exports = function (spec) {
        const comp = comparable({comparator: spec.comparator || simpleComparator});

        const lo = (function () {
            const l = spec.lo !== undefined
                ? spec.lo
                : spec.hi;
            const h = spec.hi !== undefined
                ? spec.hi
                : spec.lo;

            if (comp.lt(l, h)) {
                return l;
            }
            return h;
        }());

        const hi = (function () {
            const l = spec.lo !== undefined
                ? spec.lo
                : spec.hi;
            const h = spec.hi !== undefined
                ? spec.hi
                : spec.lo;

            if (comp.gt(h, l)) {
                return h;
            }
            return l;
        }());

        const overlaps = function (spec) {
            const interval = spec.interval;

            return comp.gt(hi, interval.lo) && comp.lt(lo, interval.hi);
        };

        const equalsInterval = function (interval) {
            return lo === interval.lo && hi === interval.hi;
        };

        const compare = function (interval) {
            return comp.lt(lo, interval.lo)
                ? -1
                : 1;
        };

        return Object.freeze({lo, hi, overlaps, equalsInterval, compare});
    };
}());
