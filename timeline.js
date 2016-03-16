/*jslint es6, node: true */

(function () {
    "use strict";

    const interval = require('./interval.js');

    module.exports = function () {
        let intervals = [];

        const getIntervals = function () {
            return intervals;
        };

        const insert = function (anInterval) {
            intervals.sort(function (interval, other) {
                return interval.compare(other);
            });

            const insertionStartIndex = intervals
                .filter((interval) => anInterval.takesPlaceAfter(interval))
                .length;

            const overlapCount = intervals
                .filter((interval) => anInterval.overlaps({interval}) || anInterval.meets(interval))
                .length;

            const lo = (function () {
                if (insertionStartIndex >= intervals.length) {
                    return anInterval.lo;
                }

                const clampedInsertionIndex = Math.min(insertionStartIndex, intervals.length - 1);

                const earlierInterval = anInterval.startsBefore(intervals[clampedInsertionIndex])
                    ? anInterval
                    : intervals[insertionStartIndex];

                return earlierInterval.lo;
            }());

            const hi = (function () {
                const insertionEndIndex = insertionStartIndex + overlapCount - 1;

                if (insertionEndIndex < 0 || insertionEndIndex >= intervals.length) {
                    return anInterval.hi;
                }

                const laterInterval = anInterval.endsAfter(intervals[insertionEndIndex])
                    ? anInterval
                    : intervals[insertionEndIndex];

                return laterInterval.hi;
            }());

            intervals.splice(
                insertionStartIndex,
                overlapCount,
                interval({lo, hi, comparator: anInterval.comparator})
            );
        };


        return Object.freeze({
            intervals: getIntervals,
            insert
        });
    };
}());
