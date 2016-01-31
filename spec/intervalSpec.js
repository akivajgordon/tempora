/*jslint es6, node: true */

(function () {
    "use strict";

    const
        interval = require('../interval.js'),

        describe = global.describe,
        it = global.it,
        expect = global.expect;

    describe("interval", function () {
        describe(".lo", function () {
            describe("when setting .lo to 0", function () {
                it("should be 0", function () {
                    expect(interval({lo: 0}).lo).toBe(0);
                });
            });

            describe("when setting .lo to 1", function () {
                it("should be 1", function () {
                    expect(interval({lo: 1}).lo).toBe(1);
                });
            });
        });

        describe(".hi property", function () {
            describe("when setting .hi to 0", function () {
                it("should be 0", function () {
                    expect(interval({hi: 0}).hi).toBe(0);
                });
            });

            describe("when setting .hi to 1", function () {
                it("should be 1", function () {
                    expect(interval({hi: 1}).hi).toBe(1);
                });
            });
        });

        describe(".lo is greater than .hi", function () {
            it("should equal interval when .lo is less than .hi", function () {
                expect(interval({lo: 1, hi: 0}))
                    .toEqual(interval({lo: 0, hi: 1}));
            });
        });
    });
}());
