// ==UserScript==
// @name         Backloggd Button Utility
// @namespace    http://vers.works/
// @version      2.3
// @icon         https://pbs.twimg.com/profile_images/1541908760607821824/3Am5dmsx_400x400.jpg
// @description  Adds customizable buttons to backloggd.
// @author       VERS
// @match        https://www.backloggd.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490955/Backloggd%20Button%20Utility.user.js
// @updateURL https://update.greasyfork.org/scripts/490955/Backloggd%20Button%20Utility.meta.js
// ==/UserScript==

// Version 2.3:
// Fixed aligning to make the buttons look better.
// (Soon I will be adding conditions so steam button only shows for pc games etc.)


(function() {
    'use strict';

    const whitelist = ['Steam', 'SteamDB', 'SteamGridDB', 'Epic Games Store', 'GOG', 'Twitch', 'Youtube', 'XBOX', 'Playstation', 'Nintendo',];

    let buttons = GM_getValue('buttons', [
        {
            name: 'Steam',
            iconUrl: 'https://i.imgur.com/9NFBdz4.png',
            searchUrl: 'https://store.steampowered.com/search/?term=',
            color: '#1a9fff',
            status: true
        },
        {
            name: 'SteamDB',
            iconUrl: 'https://i.imgur.com/t6rV9xA.png',
            searchUrl: 'https://steamdb.info/search/?a=all&q=',
            color: '#3e76cb',
            status: true
        },
        {
            name: 'SteamGridDB',
            iconUrl: 'https://i.imgur.com/oluhFHS.png',
            searchUrl: 'https://www.steamgriddb.com/search/grids?term=',
            color: '#3a6e92',
            status: true
        },
        {
            name: 'Epic Games Store',
            iconUrl: 'https://cdn2.unrealengine.com/Unreal+Engine%2Feg-logo-filled-1255x1272-0eb9d144a0f981d1cbaaa1eb957de7a3207b31bb.png',
            searchUrl: 'https://store.epicgames.com/en-US/expanded-search-results?q=',
            color: '#000000',
            status: true
        },
        {
            name: 'GOG',
            iconUrl: 'https://yt3.googleusercontent.com/wr5HXJvdt0_B0bFgxaO5Fczjl3wsofggnPGKRuLe8AWkvyRUnedkjJIKQGmztxD-Xue8qiBC=s900-c-k-c0x00ffffff-no-rj',
            searchUrl: 'https://www.gog.com/en/games?query=',
            color: '#ffffff',
            status: true
        },
        {
            name: 'Twitch',
            iconUrl: 'https://i.imgur.com/UVuf0iF.png',
            searchUrl: 'https://www.twitch.tv/search?term=',
            color: '#9046fd',
            status: true
        },
        {
            name: 'Youtube',
            iconUrl: 'https://i.imgur.com/C0Ux2Y3.png',
            searchUrl: 'https://www.youtube.com/results?search_query=',
            color: '#ff0000',
            status: true
        },
        {
            name: 'XBOX',
            iconUrl: 'https://i.imgur.com/jrItCUM.png',
            searchUrl: 'https://www.xbox.com/Search/Results?q=',
            color: '#107b10',
            status: true
        },
        {
            name: 'Playstation',
            iconUrl: 'https://i.imgur.com/wvB5DF8.png',
            searchUrl: 'https://www.playstation.com/search/?q=',
            color: '#0070d1',
            status: true
        },
        {
            name: 'Nintendo',
            iconUrl: 'https://i.imgur.com/7cGs7D6.png',
            searchUrl: 'https://www.nintendo.com/us/search/#q=',
            color: '#e70819',
            status: true
        },
        {
            name: 'Settings',
            iconUrl: 'https://i.imgur.com/WvM8EHQ.png',
            color: '#16181c',
            status: true,
            isSettings: true
        },
        {
            name: 'Remove Button',
            iconUrl: 'https://via.placeholder.com/24',
            color: '#ff0000',
            status: true,
            isSettings: true,
            isRemovable: false
        }
    ]);

    function addButton(iconUrl, searchUrl, color, status, name) {
        if (!status) {
            return;
        }

        const button = document.createElement('button');
        button.className = 'btn btn-main journal-btn custom-button';
        button.style.width = '34px';
        button.style.height = '34px';
        button.style.margin = '7px 4px 3px 4px';
        button.style.backgroundColor = color;
        button.style.border = 'none';
        button.style.display = 'inline-flex';
        button.style.justifyContent = 'center';
        button.style.alignItems = 'center';

        const icon = document.createElement('img');
        icon.src = iconUrl;
        icon.alt = 'Search';
        icon.style.width = '24px';
        icon.style.height = '24px';
        button.appendChild(icon);

        button.addEventListener('click', function() {
            if (name === 'Settings') {
                openSettingsModal();
            } else {
                const gameTitleElement = document.querySelector('#title h1');
                if (gameTitleElement) {
                    const gameTitle = encodeURIComponent(gameTitleElement.textContent.trim());
                    const searchLink = searchUrl.includes('%s') ? searchUrl.replace('%s', gameTitle) : searchUrl + gameTitle;
                    window.open(searchLink, '_blank');
                } else {
                    console.error('Game title element not found');
                }
            }
        });

        const journalButtonContainer = document.querySelector('.journal-button-container');
        if (journalButtonContainer) {
            const existingButton = journalButtonContainer.querySelector(`.custom-button[data-search="${searchUrl}"]`);
            if (!existingButton) {
                button.setAttribute('data-search', searchUrl);
                button.setAttribute('data-name', name);
                journalButtonContainer.appendChild(button);
            }
        } else {
            console.error('Journal button container not found');
        }
    }

    function addSpacer() {
        const existingSpacer = document.querySelector('.journal-button-container > .spacer');
        if (!existingSpacer) {
            const spacer = document.createElement('div');
            spacer.className = 'spacer'; // Add a class to identify the spacer
            spacer.style.height = '10px'; // Adjust the height as needed
            const journalButtonContainer = document.querySelector('.journal-button-container');
            if (journalButtonContainer) {
                const firstButton = journalButtonContainer.querySelector('.custom-button');
                if (firstButton) {
                    journalButtonContainer.insertBefore(spacer, firstButton);
                } else {
                    journalButtonContainer.appendChild(spacer); // If no buttons exist yet, just append the spacer
                }
            } else {
                console.error('Journal button container not found');
            }
        }
    }


    function updateButtons() {
        buttons.forEach(button => {
            addButton(button.iconUrl, button.searchUrl, button.color, button.status, button.name);
        });
    }

    function openSettingsModal() {
        const settingsModal = document.createElement('div');
        settingsModal.className = 'settings-modal';
        settingsModal.style.position = 'fixed';
        settingsModal.style.top = '50%';
        settingsModal.style.left = '50%';
        settingsModal.style.transform = 'translate(-50%, -50%)';
        settingsModal.style.backgroundColor = 'rgba(22, 24, 28)'; 
        settingsModal.style.borderRadius = '10px';
        settingsModal.style.padding = '20px';
        settingsModal.style.zIndex = '9999';
        settingsModal.innerHTML = `
            <h1>Backloggd Button Utility</h1>
            <p style="display: flex; align-items: center;">Script made by VERS.
                <a href="https://www.backloggd.com/u/VERS/" target="_blank">
                    <img src="https://i.imgur.com/4FLnRC9.png" alt="Icon 1" style="margin-left: 10px;; width: 19px; height: 19px;">
                </a>
                <a href="https://twitter.com/versworks" target="_blank">
                    <img src="https://i.imgur.com/yXPQwtv.png" alt="Icon 2" style="margin-left: 5px;; width: 19px; height: 19px;">
                </a>
                <a href="https://http://vers.works/" target="_blank">
                    <img src="https://i.imgur.com/oePEdTt.png" alt="Icon 3" style="margin-left: 5px;; width: 19px; height: 19px;">
                </a>
            </p>
            <p style="font-size: 12px; font-style: italic; text-align: center;">
              If you have any issues or feedback you can contact me on discord (The_Vers) <br>or in this <a href="https://www.reddit.com/r/backloggd/comments/1bopg7t/introducing_button_utility_my_script_that_adds/" target="_blank">reddit post</a>.
            </p>
            <h2>Button Settings</h2>
            <ul>
                ${buttons
                    .filter(button => !button.isSettings && button.name !== 'Remove Button')
                    .map(
                        button =>
                            `<li>
                                <label>
                                    <input type="checkbox" id="${button.name}-checkbox" ${
                                button.status ? 'checked' : ''
                            }>
                                    ${button.name}
                                </label>
                            </li>`
                    )
                    .join('')}
            </ul>
            <button id="add-button" style="background-color: #4a5e8d; border: none; color: #fff; padding: 8px 16px; cursor: pointer; border-radius: .25rem;">Add Custom Button</button>
            <button id="remove-button" style="background-color: #4a5e8d; border: none; color: #fff; padding: 8px 16px; cursor: pointer; border-radius: .25rem;">Remove Custom Button</button>
            <button id="save-settings-btn" style="background-color: #fc6399; border: none; color: #fff; padding: 8px 16px; cursor: pointer; border-radius: .25rem;">Save Settings</button>
        `;

        document.body.appendChild(settingsModal);

        const addButtonBtn = document.getElementById('add-button');
        addButtonBtn.addEventListener('click', () => {
            openAddButtonModal();
        });

        const removeButtonBtn = document.getElementById('remove-button');
        removeButtonBtn.addEventListener('click', () => {
            openRemoveButtonModal();
        });

        const saveSettingsBtn = document.getElementById('save-settings-btn');
        saveSettingsBtn.addEventListener('click', () => {
            buttons.forEach(button => {
                if (!button.isSettings) {
                    const checkbox = document.getElementById(`${button.name}-checkbox`);
                    button.status = checkbox.checked;
                }
            });

            GM_setValue('buttons', buttons);

            window.location.reload();
        });
    }



    function openRemoveButtonModal() {
        const removeButtonModal = document.createElement('div');
        removeButtonModal.className = 'remove-button-modal';
        removeButtonModal.style.position = 'fixed';
        removeButtonModal.style.top = '50%';
        removeButtonModal.style.borderRadius = '10px';
        removeButtonModal.style.left = '50%';
        removeButtonModal.style.transform = 'translate(-50%, -50%)';
        removeButtonModal.style.backgroundColor = '#242832';
        removeButtonModal.style.padding = '20px';
        removeButtonModal.style.zIndex = '9999';
        removeButtonModal.innerHTML = `
            <h2>Remove Button</h2>
            <ul>
                ${buttons
                    .filter(button => !button.isSettings && !whitelist.includes(button.name))
                    .map(
                        button =>
                            `<li>
                                <button id="remove-${button.name}" style="background-color: #fc6399; border: none; color: #ffffff; padding: 5px 5; cursor: pointer;">✖</button>
                                <span style="margin-left: 10px;">${button.name}</span>
                            </li>`
                    )
                    .join('')}
            </ul>
            <button id="close-remove-modal" style="background-color: #4a5e8d; border: none; color: #ffffff; padding: 8px 16px; cursor: pointer; margin-top: 10px;">Close</button>
        `;

        document.body.appendChild(removeButtonModal);

        buttons
            .filter(button => !button.isSettings && !whitelist.includes(button.name))
            .forEach(button => {
                const removeButton = document.getElementById(`remove-${button.name}`);
                removeButton.addEventListener('click', () => {
                    removeButtonFromList(button.name);
                    removeButton.parentElement.remove();
                });
            });

        const closeModalBtn = document.getElementById('close-remove-modal');
        closeModalBtn.addEventListener('click', () => {
            removeButtonModal.remove();
        });
    }

    function removeButtonFromList(buttonName) {
        buttons = buttons.filter(button => button.name !== buttonName);
        GM_setValue('buttons', buttons);

        const existingButtons = document.querySelectorAll('.custom-button');
        existingButtons.forEach(button => {
            button.remove();
        });

        addSpacer();
        updateButtons();
    }

    function openAddButtonModal() {
        const addButtonModal = document.createElement('div');
        addButtonModal.className = 'add-button-modal';
        addButtonModal.style.position = 'fixed';
        addButtonModal.style.top = '50%';
        addButtonModal.style.left = '50%';
        addButtonModal.style.borderRadius = '10px';
        addButtonModal.style.transform = 'translate(-50%, -50%)';
        addButtonModal.style.backgroundColor = '#242832';
        addButtonModal.style.padding = '20px';
        addButtonModal.style.zIndex = '9999';
        addButtonModal.innerHTML = `
            <h2>Add Custom Button</h2>
            <div>
                <label for="website-name" style="width: 120px;">Website Name:</label>
                <button id="info-website-name" class="info-button" style="background-color: #384361; border: none; color: #fff; padding: 3px; cursor: pointer; border-radius: 3px;">
                    <img src="https://i.imgur.com/jEbi3Oy.png" alt="Info" style="width: 15px; height: 15px;">
                </button>
                <input type="text" id="website-name" style="width: 200px;" required>
            </div>
            <div>
                <label for="icon-url" style="width: 120px;">Icon URL:</label>
                <button id="info-icon-url" class="info-button" style="background-color: #384361; border: none; color: #fff; padding: 3px; cursor: pointer; border-radius: 3px;">
                    <img src="https://i.imgur.com/jEbi3Oy.png" alt="Info" style="width: 15px; height: 15px;">
                </button>
                <input type="text" id="icon-url" style="width: 200px;" required>
            </div>
            <div>
                <label for="search-url" style="width: 120px;">Search URL:</label>
                <button id="info-search-url" class="info-button" style="background-color: #384361; border: none; color: #fff; padding: 3px; cursor: pointer; border-radius: 3px;">
                    <img src="https://i.imgur.com/jEbi3Oy.png" alt="Info" style="width: 15px; height: 15px;">
                </button>
                <input type="text" id="search-url" style="width: 200px;" required>
            </div>
            <div>
                <label for="color" style="width: 120px;">Button Color:</label>
                <button id="info-color" class="info-button" style="background-color: #384361; border: none; color: #fff; padding: 3px; cursor: pointer; border-radius: 3px;">
                    <img src="https://i.imgur.com/jEbi3Oy.png" alt="Info" style="width: 15px; height: 15px;">
                </button>
                <input type="color" id="color" value="#fc6399">
            </div>
            <button id="save-new-button" style="background-color: #fc6399; border: none; color: #fff; padding: 8px 16px; cursor: pointer; margin-top: 10px; border-radius: 3px;">Add Button</button>
            <button id="close-button" style="background-color: #4a5e8d; border: none; color: #fff; padding: 8px 16px; cursor: pointer; margin-top: 10px; border-radius: 3px;">Close</button>
        `;

        document.body.appendChild(addButtonModal);

        const saveNewButtonBtn = document.getElementById('save-new-button');
        const closeButton = document.getElementById('close-button');

        function openInfoPopup(inputId, infoText) {
            const inputElement = document.getElementById(inputId);
            const infoButton = document.getElementById(`info-${inputId}`);

            infoButton.addEventListener('click', () => {
                alert(infoText);
                inputElement.focus();
            });
        }

        const infoTexts = {
            'website-name': 'Used for enabling/disabling in the settings (Doesnt have to be exact)',
            'icon-url': `Full URL path to a (preferably transparent) PNG.
        ✅ Correct: https://i.imgur.com/n04Muj1.jpeg
        ❌ Wrong: https://cdn-icons-png.flaticon.com/512/2815/2815428`,
            'search-url': `This is a URL when you search something without the actual thing you searched.

        Simple:
Add the full URL without the thing you searched (Good if the searched term is at the end of the URL)

        Example (On google.com):
If you google test you would get: https://www.google.com/search?q=test
Then you remove 'test' and you get this, which you put into this box: https://www.google.com/search?q=

        Advanced:
In rare instances, when the searched term is not at the end of the URLm you can replace the searched term with %s, which is where the game name will be put into.

        Example (Made-up case on Gamebanana):
If the URL is:
https://gamebanana.com/search?__sSearchString=TESTOrder=best_match&_idGameRow=18557

We replace the 'TEST' with %s, which we will get:
https://gamebanana.com/search?__sSearchString=%sOrder=best_match&_idGameRow=18557`,
            'color': 'Color for the button.'
        };

        Object.keys(infoTexts).forEach(inputId => {
            openInfoPopup(inputId, infoTexts[inputId]);
        });

        saveNewButtonBtn.addEventListener('click', () => {
            const websiteNameInput = document.getElementById('website-name').value;
            const iconUrlInput = document.getElementById('icon-url').value;
            const searchUrlInput = document.getElementById('search-url').value;
            const colorInput = document.getElementById('color').value;

            const newButton = {
                name: websiteNameInput,
                iconUrl: iconUrlInput,
                searchUrl: searchUrlInput,
                color: colorInput,
                status: true
            };

            buttons.push(newButton);
            GM_setValue('buttons', buttons);

            addButton(newButton.iconUrl, newButton.searchUrl, newButton.color, newButton.status, newButton.name);

            window.location.reload();
        });

        closeButton.addEventListener('click', () => {
            addButtonModal.remove();
        });
    }


    function waitForElement(selector, callback) {
        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(interval);
                callback(element);
            }
        }, 100);
    }


    function addBadgeToElement(element) {
        const badge = document.createElement('span');
        badge.className = 'vers-badge';
        badge.textContent = 'SCRIPT\nDEV'; 
        badge.style.backgroundColor = '#1aba7c';
        badge.style.color = '#16181c';
        badge.style.fontSize = '.7rem';
        badge.style.borderRadius = '4px';
        badge.style.fontWeight = '600';
        badge.style.padding = '2px';
        badge.style.marginLeft = '5px';

        if (element.tagName.toLowerCase() === 'p') {
            badge.textContent = 'SCRIPTDEV'; 
        }

        const textNode = element.firstChild;
        element.insertBefore(badge, textNode.nextSibling);
    }

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                const addedNodes = Array.from(mutation.addedNodes);
                addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        processElements();
                    }
                });
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    addSpacer();
    updateButtons();

    waitForElement('#title h1', (element) => {
        const observer = new MutationObserver(function(mutationsList) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.target.nodeName === 'HTML') {
                    const existingButtons = document.querySelectorAll('.custom-button');
                    existingButtons.forEach(button => {
                        button.remove();
                    });
                    addSpacer();
                    updateButtons();
                }
            }
        });

        observer.observe(document, { childList: true, subtree: true });
    });

    window.onhashchange = function() {
        const existingButtons = document.querySelectorAll('.custom-button');
        existingButtons.forEach(button => {
            button.remove();
        });
        updateButtons();
    };
})();