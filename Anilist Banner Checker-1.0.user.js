// ==UserScript==
// @name         Anilist Banner Checker
// @namespace    https://anilist.co/
// @version      1.0
// @description  Closes the tab if the page has a background image URL containing "banner" on Anilist website.
// @match        https://anilist.co/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468983/Anilist%20Banner%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/468983/Anilist%20Banner%20Checker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get all elements on the page
    var elements = document.querySelectorAll('*');

    // Check each element's computed styles for a background image URL containing "banner"
    for (var i = 0; i < elements.length; i++) {
        var computedStyles = window.getComputedStyle(elements[i]);
        var backgroundImage = computedStyles.getPropertyValue('background-image');

        if (backgroundImage.includes('banner')) {
            // Close the current tab
            window.close();
            break;
        }
    }
})();
