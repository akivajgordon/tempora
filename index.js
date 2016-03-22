/*jslint es6, node: true */
/*global window */

(function () {
    "use strict";

    const timeline = require('./lib/timeline.js');

    const Tempora = Object.freeze({timeline});

    if (module && module.exports) {
        module.exports = Tempora;
    } else {
        window.Tempora = Tempora;
    }
}());
