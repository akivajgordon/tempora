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
                const i = interval({lo: 1, hi: 0});
                const j = interval({lo: 0, hi: 1});
                expect({lo: i.lo, hi: i.hi}).toEqual({lo: j.lo, hi: j.hi});
            });
        });

        describe("overlaps()", function () {
            describe("simple overlap", function () {
                it("should return true", function () {
                    const i = interval({lo: 0, hi: 2});
                    const j = interval({lo: 1, hi: 3});

                    expect(i.overlaps({interval: j})).toBe(true);
                });
            });

            describe("interval before another interval", function () {
                it("should return false", function () {
                    const i = interval({lo: 0, hi: 1});
                    const j = interval({lo: 2, hi: 3});

                    expect(i.overlaps({interval: j})).toBe(false);
                });
            });

            describe("interval after another interval", function () {
                it("should return false", function () {
                    const i = interval({lo: 2, hi: 3});
                    const j = interval({lo: 0, hi: 1});

                    expect(i.overlaps({interval: j})).toBe(false);
                });
            });
        });
    });
}());
