/*jslint es6, node: true */

(function () {
    "use strict";

    const timeline = require('../timeline.js');

    const describe = global.describe;
    const it = global.it;
    const expect = global.expect;

    describe("timeline", function () {
        describe("new instance", function () {
            it("should have 0 intervals", function () {
                expect(timeline().intervals().length).toBe(0);
            });
        });
    });
}());
