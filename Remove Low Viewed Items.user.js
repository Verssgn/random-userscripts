// ==UserScript==
// @name         Remove Low Viewed Items
// @version      1
// @description  ---
// @author       ---
// @include      https://forum.mobilism.me/*
// @exclude      https://forum.mobilism.me/search.php*
// @grant        none
// @icon         https://appteka.store/api/1/icon/get?hash=RX8e2o6szkEcr%2F33y9Hua%2F4nHB9Lru0w568H9zc9Uc85Ix23fck0q%2F3PPVYkw3KN
// ==/UserScript==

(function() {
    'use strict';

    const MIN_VIEWS = 1500;

    function removeLowViewedRows() {
        const rows = document.querySelectorAll('tr');
        rows.forEach(row => {
            const viewsSpan = row.querySelector('.sub-stats-info:last-child');
            if (viewsSpan && viewsSpan.innerText.includes('VIEWS')) {
                const views = parseInt(viewsSpan.previousElementSibling.innerText);
                if (views < MIN_VIEWS) {
                    row.remove();
                }
            }
        });
    }

    removeLowViewedRows();
})();
