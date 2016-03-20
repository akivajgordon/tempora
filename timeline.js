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

        const insert = function (anInterval) {
            intervals.sort(function (anInterval, other) {
                return interval(anInterval).compare(interval(other));
            });

            const insertionStartIndex = intervals
                .filter((other) => interval(anInterval).takesPlaceAfter(interval(other)))
                .length;

            const overlapCount = intervals
                .filter((other) => interval(anInterval).overlaps(interval(other)) || interval(anInterval).meets(interval(other)))
                .length;

            const lo = (function () {
                if (insertionStartIndex >= intervals.length) {
                    return anInterval.lo;
                }

                const clampedInsertionIndex = Math.min(insertionStartIndex, intervals.length - 1);

                const earlierInterval = interval(anInterval).startsBefore(interval(intervals[clampedInsertionIndex]))
                    ? anInterval
                    : intervals[insertionStartIndex];

                return earlierInterval.lo;
            }());

            const hi = (function () {
                const insertionEndIndex = insertionStartIndex + overlapCount - 1;

                if (insertionEndIndex < 0 || insertionEndIndex >= intervals.length) {
                    return anInterval.hi;
                }

                const laterInterval = interval(anInterval).endsAfter(interval(intervals[insertionEndIndex]))
                    ? anInterval
                    : intervals[insertionEndIndex];

                return laterInterval.hi;
            }());

            intervals.splice(
                insertionStartIndex,
                overlapCount,
                {lo, hi, comparator: anInterval.comparator}
            );
        };

        const remove = function (anInterval) {
            intervals = intervals.filter(function (existingInterval) {
                return !(interval(anInterval).startsBefore(interval(existingInterval))
                        && interval(anInterval).endsAfter(interval(existingInterval)));
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
