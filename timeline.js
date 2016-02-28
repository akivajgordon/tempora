/*jslint es6, node: true */

(function () {
    "use strict";

    // const interval = require('./interval.js');

    module.exports = function () {
        let intervals = [];

        const getIntervals = function () {
            return intervals.sort(function (interval, other) {
                return interval.compare(other);
            });
        };

        const insert = function (interval) {
            intervals.push(interval);
        };


        return Object.freeze({
            intervals: getIntervals,
            insert
        });
    };
}());
