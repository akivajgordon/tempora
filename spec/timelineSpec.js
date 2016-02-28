/*jslint es6, node: true */

(function () {
    "use strict";

    const timeline = require('../timeline.js');
    const interval = require('../interval.js');

    const jasmine = global.jasmine;
    const describe = global.describe;
    const it = global.it;
    const expect = global.expect;
    const beforeEach = global.beforeEach;

    const intervalsAreEqual = function (interval, other) {
        const isInterval = function (interval) {
            return interval.hasOwnProperty('lo') && interval.hasOwnProperty('hi');
        };

        if (isInterval(interval) && isInterval(other)) {
            return interval.equalsInterval(other);
        }
    };

    describe("timeline", function () {
        describe("new instance", function () {
            it("should have 0 intervals", function () {
                expect(timeline().intervals().length).toBe(0);
            });
        });

        describe("intervals after inserting", function () {
            let t;

            beforeEach(function () {
                jasmine.addCustomEqualityTester(intervalsAreEqual);

                t = timeline();
            });

            describe("simple interval", function () {
                it("should be same as input interval", function () {
                    t.insert(interval({lo: 0, hi: 1}));

                    expect(t.intervals()).toEqual([
                        interval({lo: 0, hi: 1})
                    ]);
                });
            });

            describe("another simple interval", function () {
                it("should be same as input interval", function () {
                    t.insert(interval({lo: 2, hi: 3}));

                    expect(t.intervals()).toEqual([
                        interval({lo: 2, hi: 3})
                    ]);
                });
            });

            describe("two simple intervals", function () {
                it("should be same as input intervals", function () {
                    t.insert(interval({lo: 0, hi: 1}));
                    t.insert(interval({lo: 2, hi: 3}));

                    expect(t.intervals()).toEqual([
                        interval({lo: 0, hi: 1}),
                        interval({lo: 2, hi: 3})
                    ]);
                });
            });
        });
    });
}());
