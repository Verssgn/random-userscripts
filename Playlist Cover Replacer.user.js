// ==UserScript==
// @name         Playlist Cover Replacer
// @version      0.1
// @description  Ability to change playlist cover.
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @author       VERS
// @license MIT
// @match        https://music.youtube.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @namespace https://greasyfork.org/users/1105828
// @downloadURL https://update.greasyfork.org/scripts/493560/Playlist%20Cover%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/493560/Playlist%20Cover%20Replacer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to replace the clicked image
    function replaceClickedImage(clickedImage) {
        // Check if a custom cover is already applied
        var storedImageSrc = GM_getValue(clickedImage.src);
        if (storedImageSrc) {
            var deleteExistingCover = confirm("A custom cover is already applied. Do you want to delete it and add a new one?");
            if (!deleteExistingCover) {
                return; 
            } else {
                GM_deleteValue(clickedImage.src);
            }
        } else {
            var newSrc = prompt("Enter the URL of the new image (must be .png, .jpg, .jpeg, or .gif) Important: Once you apply an image you wont be able to get the original cover.");

            if (newSrc === null) {
                return; 
            }

            if (newSrc && /\.(png|jpg|jpeg|gif)$/i.test(newSrc)) {
                GM_setValue(clickedImage.src, newSrc);

                clickedImage.src = newSrc;
            } else {
                alert("Invalid image URL. Please enter a URL ending with .png, .jpg, .jpeg, or .gif");
            }
        }
    }

    function replaceStoredImages() {
        var allImages = document.querySelectorAll('img');
        allImages.forEach(function(img) {
            var storedImageSrc = GM_getValue(img.src);
            if (storedImageSrc && storedImageSrc !== img.src) {
                img.src = storedImageSrc;
            }
        });
    }


    document.addEventListener('click', function(event) {
        var clickedImage = event.target;
        if (clickedImage.tagName === 'IMG') {
            replaceClickedImage(clickedImage);
        }
    });


    var observer = new MutationObserver(function(mutationsList, observer) {
        for (var mutation of mutationsList) {
            if (mutation.type === 'childList') {
                replaceStoredImages();
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    replaceStoredImages();
})();
