/*jslint es6, node: true */

(function () {
    "use strict";

    const Tempora = require('..');
    const timeline = Tempora.timeline;
    const interval = require('../lib/interval.js');
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

            describe("an array of simple intervals", function () {
                it("should be the same as inserting each one-by-one", function () {
                    const intervals = [{lo: 0, hi: 1}, {lo: 2, hi: 3}];

                    t.insert(intervals);

                    const oneByOneTimeline = timeline();
                    intervals.forEach(function (interval) {
                        oneByOneTimeline.insert(interval);
                    });

                    expect(t.intervals()).toEqual(oneByOneTimeline.intervals());
                });
            });

            describe("another array of simple intervals", function () {
                it("should be the same as inserting each one-by-one", function () {
                    const intervals = [{lo: 2, hi: 5}, {lo: 10, hi: 20}];

                    t.insert(intervals);

                    const oneByOneTimeline = timeline();
                    intervals.forEach(function (interval) {
                        oneByOneTimeline.insert(interval);
                    });

                    expect(t.intervals()).toEqual(oneByOneTimeline.intervals());
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

            describe("an array of intervals", function () {
                it("should equal intervals after removing one-by-one", function () {
                    const insertingIntervals = [
                        {lo: 0, hi: 3},
                        {lo: 5, hi: 10}
                    ];

                    const removingIntervals = [
                        {lo: 1, hi: 2},
                        {lo: 6, hi: 8}
                    ];

                    const asArrayTimeline = timeline();
                    asArrayTimeline.insert(insertingIntervals);
                    asArrayTimeline.remove(removingIntervals);

                    const asOneByOneTimeline = timeline();
                    asOneByOneTimeline.insert(insertingIntervals);
                    removingIntervals.forEach(function (interval) {
                        asOneByOneTimeline.remove(interval);
                    });

                    expect(asArrayTimeline.intervals()).toEqual(asOneByOneTimeline.intervals());
                });
            });

            describe("an array of intervals", function () {
                it("should equal intervals after removing one-by-one", function () {
                    const insertingIntervals = [
                        {lo: 4, hi: 8},
                        {lo: 10, hi: 20}
                    ];

                    const removingIntervals = [
                        {lo: 6, hi: 12},
                        {lo: 15, hi: 18}
                    ];

                    const asArrayTimeline = timeline();
                    asArrayTimeline.insert(insertingIntervals);
                    asArrayTimeline.remove(removingIntervals);

                    const asOneByOneTimeline = timeline();
                    asOneByOneTimeline.insert(insertingIntervals);
                    removingIntervals.forEach(function (interval) {
                        asOneByOneTimeline.remove(interval);
                    });

                    expect(asArrayTimeline.intervals()).toEqual(asOneByOneTimeline.intervals());
                });
            });
        });

        describe("contains()", function () {
            describe("an interval in the timeline", function () {
                it("should be true", function () {
                    t.insert([{lo: 0, hi: 10}, {lo: 15, hi: 20}]);

                    expect(t.contains({lo: 2, hi: 8})).toBe(true);
                });
            });

            describe("an interval not in the timeline", function () {
                it("should be false", function () {
                    t.insert([{lo: 0, hi: 10}, {lo: 15, hi: 20}]);

                    expect(t.contains({lo: 11, hi: 12})).toBe(false);
                });
            });

            describe("an interval partially in the timeline", function () {
                it("should be false", function () {
                    t.insert([{lo: 0, hi: 10}, {lo: 15, hi: 20}]);

                    expect(t.contains({lo: 8, hi: 12})).toBe(false);
                });
            });

            describe("a size interval partially in the timeline", function () {
                it("should be false", function () {
                    const tl = timeline({comparator: sizeComparator});

                    tl.insert([
                        {lo: 'xxs', hi: 'm'},
                        {lo: 'l', hi: 'xxl'}
                    ]);

                    expect(tl.contains({lo: 's', hi: 'l'})).toBe(false);
                });
            });
        });
    });
}());
