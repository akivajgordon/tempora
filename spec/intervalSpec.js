/*jslint es6, node: true */

(function () {
    "use strict";

    const
        interval = require('../interval.js'),
        sizeComparator = require('./fixtures/sizeComparator.js'),
        momentComparator = require('./fixtures/momentComparator.js'),
        moment = require('moment'),

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

            describe("when not setting .lo and setting .hi to 0", function () {
                it("should be 0", function () {
                    expect(interval({hi: 0}).lo).toBe(0);
                });
            });

            describe("when not setting .lo and setting .hi to 1", function () {
                it("should be 1", function () {
                    expect(interval({hi: 1}).lo).toBe(1);
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

            describe("when not setting .hi and setting .lo to 0", function () {
                it("should be 0", function () {
                    expect(interval({lo: 0}).hi).toBe(0);
                });
            });

            describe("when not setting .hi and setting .lo to -1", function () {
                it("should be -1", function () {
                    expect(interval({lo: -1}).hi).toBe(-1);
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

                    expect(i.overlaps(j)).toBe(true);
                });
            });

            describe("interval before another interval", function () {
                it("should return false", function () {
                    const i = interval({lo: 0, hi: 1});
                    const j = interval({lo: 2, hi: 3});

                    expect(i.overlaps(j)).toBe(false);
                });
            });

            describe("interval after another interval", function () {
                it("should return false", function () {
                    const i = interval({lo: 2, hi: 3});
                    const j = interval({lo: 0, hi: 1});

                    expect(i.overlaps(j)).toBe(false);
                });
            });

            describe("custom comparator", function () {
                describe("overlapping size intervals", function () {
                    it("should return true", function () {
                        const i = interval({lo: 's', hi: 'l', comparator: sizeComparator});
                        const j = interval({lo: 'xs', hi: 'm', comparator: sizeComparator});

                        expect(i.overlaps(j)).toBe(true);
                    });
                });
            });
        });

        describe("equalsInterval()", function () {
            describe("two intervals with same lo and hi", function () {
                it("should be true", function () {
                    const i = interval({lo: 0, hi: 1});
                    const j = interval({lo: 0, hi: 1});

                    expect(i.equalsInterval(j)).toBe(true);
                });
            });

            describe("two intervals with different lo and hi", function () {
                it("should be false", function () {
                    const i = interval({lo: 0, hi: 1});
                    const j = interval({lo: 2, hi: 3});

                    expect(i.equalsInterval(j)).toBe(false);
                });
            });

            describe("two moment intervals with same lo and hi", function () {
                it("should be true", function () {
                    const i = interval({lo: moment('2016-01-01'), hi: moment('2016-01-03'), comparator: momentComparator});
                    const j = interval({lo: moment('2016-01-01'), hi: moment('2016-01-03'), comparator: momentComparator});

                    expect(i.equalsInterval(j)).toBe(true);
                });
            });
        });

        describe("compare()", function () {
            describe("interval with low less than other low", function () {
                it("should return a negative number", function () {
                    const i = interval({lo: 0, hi: 1});
                    const j = interval({lo: 2, hi: 3});

                    expect(i.compare(j)).toBeLessThan(0);
                });
            });

            describe("interval with low greater than other low", function () {
                it("should return a positive number", function () {
                    const i = interval({lo: 'm', hi: 'xl', comparator: sizeComparator});
                    const j = interval({lo: 's', hi: 'l', comparator: sizeComparator});

                    expect(i.compare(j)).toBeGreaterThan(0);
                });
            });
        });

        describe("takesPlaceAfter()", function () {
            describe("interval with lo before other high", function () {
                it("should return false", function () {
                    const i = interval({lo: 0, hi: 2});
                    const j = interval({lo: 1, hi: 3});

                    expect(j.takesPlaceAfter(i)).toBe(false);
                });
            });

            describe("interval with lo after other high", function () {
                it("should return true", function () {
                    const i = interval({lo: 0, hi: 1});
                    const j = interval({lo: 2, hi: 3});

                    expect(j.takesPlaceAfter(i)).toBe(true);
                });
            });

            describe("interval with lo size after other high size", function () {
                it("should return true", function () {
                    const i = interval({lo: 's', hi: 'm', comparator: sizeComparator});
                    const j = interval({lo: 'l', hi: 'xl', comparator: sizeComparator});

                    expect(j.takesPlaceAfter(i)).toBe(true);
                });
            });
        });

        describe("toString()", function () {
            describe("simple interval", function () {
                it("should look like '{lo, hi}'", function () {
                    expect(interval({lo: 0, hi: 1}).toString()).toBe('{0, 1}');
                });
            });

            describe("a reversed interval", function () {
                it("should look like '{lo, hi}'", function () {
                    expect(interval({lo: 2, hi: 0}).toString()).toBe('{0, 2}');
                });
            });
        });

        describe("startsBefore()", function () {
            describe("an interval that starts before", function () {
                it("should return true", function () {
                    const i = interval({lo: 0, hi: 2});
                    const j = interval({lo: 1, hi: 3});

                    expect(i.startsBefore(j)).toBe(true);
                });
            });

            describe("a size that starts after", function () {
                it("should return false", function () {
                    const i = interval({lo: 'm', hi: 'l', comparator: sizeComparator});
                    const j = interval({lo: 's', hi: 'l', comparator: sizeComparator});

                    expect(i.startsBefore(j)).toBe(false);
                });
            });
        });

        describe("endsAfter()", function () {
            describe("an interval that ends after", function () {
                it("should return true", function () {
                    const i = interval({lo: 0, hi: 2});
                    const j = interval({lo: 0, hi: 1});

                    expect(i.endsAfter(j)).toBe(true);
                });
            });

            describe("a size that ends before", function () {
                it("should return false", function () {
                    const i = interval({lo: 'm', hi: 'l', comparator: sizeComparator});
                    const j = interval({lo: 's', hi: 'xl', comparator: sizeComparator});

                    expect(i.endsAfter(j)).toBe(false);
                });
            });
        });

        describe("meets()", function () {
            describe("two unmeeting intervals", function () {
                it("should return false", function () {
                    const i = interval({lo: 0, hi: 1});
                    const j = interval({lo: 2, hi: 3});

                    expect(i.meets(j)).toBe(false);
                });
            });

            describe("two meeting moment intervals at lo end", function () {
                it("should return true", function () {
                    const i = interval({lo: moment('2015-11-02'), hi: moment('2015-12-21'), comparator: momentComparator});
                    const j = interval({lo: moment('2015-12-21'), hi: moment('2015-12-31'), comparator: momentComparator});

                    expect(i.meets(j)).toBe(true);
                });
            });

            describe("two meeting moment intervals at lo end", function () {
                it("should return true", function () {
                    const i = interval({lo: moment('2015-12-21'), hi: moment('2015-12-31'), comparator: momentComparator});
                    const j = interval({lo: moment('2015-11-02'), hi: moment('2015-12-21'), comparator: momentComparator});

                    expect(i.meets(j)).toBe(true);
                });
            });
        });
    });
}());
