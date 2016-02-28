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
            intervals.push(anInterval);

            intervals.sort(function (interval, other) {
                return interval.compare(other);
            });

            const firstInterval = intervals[0];
            const secondInterval = intervals[1];

            if (secondInterval && firstInterval.overlaps({interval: secondInterval})) {

                intervals = [interval({
                    lo: firstInterval.lo,
                    hi: secondInterval.hi
                })];
            }
        };


        return Object.freeze({
            intervals: getIntervals,
            insert
        });
    };
}());
