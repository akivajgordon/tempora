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

        const spliceStartIndex = function (anInterval) {
            const intervalToBeInserted = intervaler(anInterval);
            let i = 0;

            while (i < intervals.length && intervalToBeInserted.takesPlaceAfter(intervaler(intervals[i]))) {
                i += 1;
            }

            return i;
        };

        const overlapCountFromIndex = function (anInterval, fromIndex) {
            const intervalToBeRemoved = intervaler(anInterval);
            let i = fromIndex;

            while (i < intervals.length && !intervaler(intervals[i]).takesPlaceAfter(intervalToBeRemoved)) {
                i += 1;
            }

            return i - fromIndex;
        };

        const insertOne = function (anInterval) {

            const insertionStartIndex = spliceStartIndex(anInterval);

            const overlapCount = overlapCountFromIndex(anInterval, insertionStartIndex);

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

        const insert = function (anInterval) {
            if (Array.isArray(anInterval)) {
                anInterval.forEach(function (i) {
                    insertOne(i);
                });
            } else {
                insertOne(anInterval);
            }
        };

        const removeOne = function (anInterval) {
            const removalStartIndex = spliceStartIndex(anInterval);

            const overlapCount = overlapCountFromIndex(anInterval, removalStartIndex);

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

            const possibleInsertions = [loInsertion, hiInsertion];

            Array.prototype.splice.apply(intervals, [
                removalStartIndex,
                overlapCount
            ].concat(possibleInsertions.filter((insertion) => insertion)));
        };

        const remove = function (anInterval) {
            if (Array.isArray(anInterval)) {
                anInterval.forEach(function (i) {
                    removeOne(i);
                });
            } else {
                removeOne(anInterval);
            }
        };

        const contains = function (anInterval) {
            const queryInterval = intervaler(anInterval);
            return intervals
                .some(function (interval) {
                    const thisInterval = intervaler(interval);

                    return (
                        thisInterval.startsBefore(queryInterval) ||
                        thisInterval.startsWith(queryInterval)
                    ) && (
                        thisInterval.endsAfter(queryInterval) ||
                        thisInterval.endsWith(queryInterval)
                    );
                });
        };

        return Object.freeze({
            comparator: comparator,
            intervals: getIntervals,
            insert,
            remove,
            contains
        });
    };
}());
