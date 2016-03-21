/*jslint es6, node: true */

(function () {
    "use strict";

    const interval = require('./interval.js');

    module.exports = function (spec) {
        let intervals = [];

        const comparator = spec && spec.comparator;

        const getIntervals = function () {
            return intervals;
        };

        const intervaler = function (anInterval) {
            return interval({lo: anInterval.lo, hi: anInterval.hi, comparator: comparator});
        };

        const insert = function (anInterval) {
            intervals.sort(function (anInterval, other) {
                return intervaler(anInterval).compare(intervaler(other));
            });

            const insertionStartIndex = intervals
                .filter((other) => intervaler(anInterval).takesPlaceAfter(intervaler(other)))
                .length;

            const overlapCount = intervals
                .filter((other) => intervaler(anInterval).overlaps(intervaler(other))
                        || intervaler(anInterval).meets(intervaler(other)))
                .length;

            const lo = (function () {
                if (insertionStartIndex >= intervals.length) {
                    return anInterval.lo;
                }

                const clampedInsertionIndex = Math.min(insertionStartIndex, intervals.length - 1);

                const earlierInterval = intervaler(anInterval).startsBefore(intervaler(intervals[clampedInsertionIndex]))
                    ? anInterval
                    : intervals[insertionStartIndex];

                return earlierInterval.lo;
            }());

            const hi = (function () {
                const insertionEndIndex = insertionStartIndex + overlapCount - 1;

                if (insertionEndIndex < 0 || insertionEndIndex >= intervals.length) {
                    return anInterval.hi;
                }

                const laterInterval = intervaler(anInterval).endsAfter(intervaler(intervals[insertionEndIndex]))
                    ? anInterval
                    : intervals[insertionEndIndex];

                return laterInterval.hi;
            }());

            intervals.splice(
                insertionStartIndex,
                overlapCount,
                {lo, hi, comparator}
            );
        };

        const remove = function (anInterval) {
            intervals = intervals.filter(function (existingInterval) {
                return !(intervaler(anInterval).startsBefore(intervaler(existingInterval))
                        && intervaler(anInterval).endsAfter(intervaler(existingInterval)));
            });
        };

        return Object.freeze({
            comparator: comparator,
            intervals: getIntervals,
            insert,
            remove
        });
    };
}());
