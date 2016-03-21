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
            // intervals = intervals.filter(function (existingInterval) {
            //     return !(intervaler(anInterval).startsBefore(intervaler(existingInterval))
            //             && intervaler(anInterval).endsAfter(intervaler(existingInterval)));
            // });

            const removalStartIndex = intervals
                .filter((other) => intervaler(anInterval).takesPlaceAfter(intervaler(other)))
                .length;

            const overlapCount = intervals
                .filter((other) => intervaler(anInterval).overlaps(intervaler(other)))
                .length;

            const loInsertion = (function () {
                if (removalStartIndex >= intervals.length || overlapCount === 0) {
                    return null;
                }

                const loInterval = intervaler(intervals[removalStartIndex]);

                if (loInterval.startsBefore(intervaler(anInterval))) {
                    return {
                        lo: loInterval.lo,
                        hi: anInterval.lo,
                        comparator: comparator
                    };
                }

                return null;
            }());

            const hiInsertion = (function () {
                const removalEndIndex = removalStartIndex + overlapCount - 1;

                if (removalEndIndex >= intervals.length || overlapCount === 0) {
                    return null;
                }

                const hiInterval = intervaler(intervals[removalEndIndex]);

                if (hiInterval.endsAfter(intervaler(anInterval))) {
                    return {
                        lo: anInterval.hi,
                        hi: hiInterval.hi,
                        comparator: comparator
                    };
                }

                return null;
            }());

            const insertions = [loInsertion, hiInsertion].filter((insertion) => insertion);

            Array.prototype.splice.apply(intervals, [
                removalStartIndex,
                overlapCount
            ].concat(insertions));
        };

        return Object.freeze({
            comparator: comparator,
            intervals: getIntervals,
            insert,
            remove
        });
    };
}());
