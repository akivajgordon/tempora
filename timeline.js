/*jslint es6, node: true */

(function () {
    "use strict";

    // const interval = require('./interval.js');

    module.exports = function () {
        let intervals = [];

        const getIntervals = function () {
            return intervals;
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
