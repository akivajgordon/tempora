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

        const overlaps = function (interval) {
            return comp.gt(hi, interval.lo) && comp.lt(lo, interval.hi);
        };

        const equalsInterval = function (interval) {
            return comp.eq(lo, interval.lo) && comp.eq(hi, interval.hi);
        };

        const startsBefore = function (interval) {
            return comp.lt(lo, interval.lo);
        };

        const endsAfter = function (interval) {
            return comp.gt(hi, interval.hi);
        };

        const takesPlaceAfter = function (interval) {
            return comp.gt(lo, interval.hi);
        };

        const compare = function (interval) {
            return startsBefore(interval)
                ? -1
                : 1;
        };


        const toString = function () {
            return `{${lo}, ${hi}}`;
        };

        const meets = function (interval) {
            return comp.eq(hi, interval.lo) || comp.eq(lo, interval.hi);
        };

        return Object.freeze({lo, hi, overlaps, equalsInterval, compare, takesPlaceAfter, toString, startsBefore, endsAfter, comparator: comp, meets});
    };
}());
