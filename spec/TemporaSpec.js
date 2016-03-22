/*jslint es6, node: true */

(function () {
    "use strict";

    const Tempora = require('../index.js');
    const timeline = require('../lib/timeline.js');

    const describe = global.describe;
    const it = global.it;
    const expect = global.expect;

    describe("Tempora", function () {
        it("should have timeline", function () {
            expect(Tempora.timeline).toBe(timeline);
        });
    });
}());
