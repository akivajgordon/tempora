/*jslint es6, node: true */

(function () {
    "use strict";

    const timeline = require('../timeline.js');
    const interval = require('../interval.js');
    const moment = require('moment');
    const sizeComparator = require('./fixtures/sizeComparator.js');
    const momentComparator = require('./fixtures/momentComparator.js');

    const jasmine = global.jasmine;
    const describe = global.describe;
    const it = global.it;
    const expect = global.expect;
    const beforeEach = global.beforeEach;

    const intervalsAreEqual = function (anInterval, other) {
        const isInterval = function (interval) {
            return interval.hasOwnProperty('lo') && interval.hasOwnProperty('hi');
        };

        if (isInterval(anInterval) && isInterval(other)) {
            return interval(anInterval).equalsInterval(interval(other));
        }
    };

    describe("timeline", function () {
        let t;

        beforeEach(function () {
            jasmine.addCustomEqualityTester(intervalsAreEqual);

            t = timeline();
        });

        describe("new instance", function () {
            it("should have 0 intervals", function () {
                expect(timeline().intervals().length).toBe(0);
            });

            describe("with a size comparator", function () {
                it("should set the comparator", function () {
                    const c = sizeComparator;
                    const tl = timeline({comparator: c});

                    expect(tl.comparator).toBe(c);
                });
            });

            describe("with a moment comparator", function () {
                it("should set the comparator", function () {
                    const c = momentComparator;
                    const tl = timeline({comparator: c});

                    expect(tl.comparator).toBe(c);
                });
            });
        });

        describe("intervals after inserting", function () {
            describe("simple interval", function () {
                it("should be same as input interval", function () {
                    t.insert({lo: 0, hi: 1});

                    expect(t.intervals()).toEqual([
                        {lo: 0, hi: 1}
                    ]);
                });
            });

            describe("another simple interval", function () {
                it("should be same as input interval", function () {
                    t.insert({lo: 2, hi: 3});

                    expect(t.intervals()).toEqual([
                        {lo: 2, hi: 3}
                    ]);
                });
            });

            describe("size interval", function () {
                it("should be same as input interval", function () {
                    const tl = timeline({comparator: sizeComparator});

                    tl.insert({lo: 's', hi: 'l'});

                    expect(tl.intervals()).toEqual([{lo: 's', hi: 'l', comparator: sizeComparator}]);
                });
            });

            describe("two simple intervals", function () {
                it("should be same as input intervals", function () {
                    t.insert({lo: 0, hi: 1});
                    t.insert({lo: 2, hi: 3});

                    expect(t.intervals()).toEqual([
                        {lo: 0, hi: 1},
                        {lo: 2, hi: 3}
                    ]);
                });
            });

            describe("three unordered (non-overlapping) intervals", function () {
                it("should be sorted by lo value", function () {
                    t.insert({lo: 5, hi: 10});
                    t.insert({lo: 0, hi: 1});
                    t.insert({lo: 2, hi: 3});

                    expect(t.intervals()).toEqual([
                        {lo: 0, hi: 1},
                        {lo: 2, hi: 3},
                        {lo: 5, hi: 10}
                    ]);
                });
            });

            describe("two overlapping intervals", function () {
                it("should be one joined interval", function () {
                    t.insert({lo: 0, hi: 2});
                    t.insert({lo: 1, hi: 3});

                    expect(t.intervals()).toEqual([
                        {lo: 0, hi: 3}
                    ]);
                });
            });

            describe("another two overlapping intervals", function () {
                it("should be one joined interval", function () {
                    t.insert({lo: 2, hi: 5});
                    t.insert({lo: 4, hi: 10});

                    expect(t.intervals()).toEqual([
                        {lo: 2, hi: 10}
                    ]);
                });
            });

            describe("internal overlapping intervals", function () {
                it("should join the internal overlapping intervals", function () {
                    t.insert({lo: 0, hi: 1});
                    t.insert({lo: 2, hi: 3});
                    t.insert({lo: 4, hi: 5});
                    t.insert({lo: 6, hi: 7});
                    t.insert({lo: 2.5, hi: 5.5});

                    expect(t.intervals()).toEqual([
                        {lo: 0, hi: 1},
                        {lo: 2, hi: 5.5},
                        {lo: 6, hi: 7}
                    ]);
                });
            });

            describe("intervals that meet", function () {
                it("should join the intervals", function () {
                    t.insert({lo: 2, hi: 3});
                    t.insert({lo: 0, hi: 2});

                    expect(t.intervals()).toEqual([{lo: 0, hi: 3}]);
                });
            });

            describe("size intervals that meet", function () {
                it("should join the intervals", function () {
                    const tl = timeline({comparator: sizeComparator});

                    tl.insert({lo: 's', hi: 'm'});
                    tl.insert({lo: 'm', hi: 'l'});

                    expect(tl.intervals()).toEqual([
                        {lo: 's', hi: 'l', comparator: sizeComparator}
                    ]);
                });
            });
        });

        describe("intervals after removing", function () {

            const intervals = [
                {lo: moment('2016-02-23'), hi: moment('2016-02-25'), comparator: momentComparator},
                {lo: moment('2016-03-13'), hi: moment('2016-03-15'), comparator: momentComparator},
                {lo: moment('2016-05-23'), hi: moment('2016-05-25'), comparator: momentComparator}
            ];

            let tl;

            beforeEach(function () {
                tl = timeline({comparator: momentComparator});

                intervals.forEach(function (interval) {
                    tl.insert(interval);
                });
            });

            describe("an interval that is not on the timeline", function () {
                it("should be unchanged", function () {
                    tl.remove({lo: moment('2016-04-13'), hi: moment('2016-04-15')});

                    expect(tl.intervals()).toEqual(intervals);
                });
            });

            describe("an interval that overlaps the entire timeline", function () {
                it("should be empty", function () {
                    tl.remove({lo: moment('2016-01-01'), hi: moment('2016-12-31')});

                    expect(tl.intervals()).toEqual([]);
                });
            });

            describe("an interval that ends before the first interval on the entire timeline", function () {
                it("should be unchanged", function () {
                    tl.remove({lo: moment('2016-01-01'), hi: moment('2016-01-31')});

                    expect(tl.intervals()).toEqual(intervals);
                });
            });

            describe("interval that contains an existing timeline interval", function () {
                it("should be all intervals except the contained one", function () {
                    tl.remove({lo: moment('2016-03-01'), hi: moment('2016-04-01')});

                    expect(tl.intervals()).toEqual([
                        {lo: moment('2016-02-23'), hi: moment('2016-02-25'), comparator: momentComparator},
                        {lo: moment('2016-05-23'), hi: moment('2016-05-25'), comparator: momentComparator}
                    ]);
                });
            });

            describe("interval that partially overlaps existing timeline interval", function () {
                it("should be unoverlapped intervals", function () {
                    tl.remove({lo: moment('2016-03-01'), hi: moment('2016-03-14')});

                    expect(tl.intervals()).toEqual([
                        {lo: moment('2016-02-23'), hi: moment('2016-02-25'), comparator: momentComparator},
                        {lo: moment('2016-03-14'), hi: moment('2016-03-15'), comparator: momentComparator},
                        {lo: moment('2016-05-23'), hi: moment('2016-05-25'), comparator: momentComparator}
                    ]);
                });
            });
        });
    });
}());
