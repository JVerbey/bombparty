// ==UserScript==
// @name        BombParty
// @namespace   myerffoeg
// @version     2.0.1
// @author      Geoffrey Migliacci
// @description A BombParty simple cheat.
// @homepage    https://github.com/myerffoeg/bombparty
// @icon        https://raw.githubusercontent.com/myerffoeg/bombparty/master/BombParty.png
// @updateURL   https://github.com/myerffoeg/bombparty/releases/latest/download/BombParty.user.js
// @downloadURL https://github.com/myerffoeg/bombparty/releases/latest/download/BombParty.user.js
// @supportURL  https://github.com/myerffoeg/bombparty/issues
// @match       https://*.jklm.fun/games/bombparty/
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @run-at      document-idle
// @grant       none
// @nocompat    Chrome
// ==/UserScript==

let configuration = localStorage.getItem('BombpartyConfiguration') === null ? {
    bot: 0,
    botStart: 1000,
    botRandomStart: 500,
    typingSpeed: 100,
    typingRandom: 50,
    failByLetter: 5
} : JSON.parse(localStorage.getItem('BombpartyConfiguration'));

jQuery(document).ready(() => {
    jQuery.ajax({
        method: 'GET',
        url: `https://raw.githubusercontent.com/myerffoeg/bombparty/master/BombParty.user.json`,
        cache: true,
        dataType: 'json',
        success: (words) => {
            jQuery(document).keydown((ev) => {
                if (!milestone) {
                    return;
                }

                if (ev.code !== 'ShiftRight') {
                    return;
                }

                jQuery(`
                <div class="rule">
                    <div class="label">BombParty</div>
                    <div class="field">
                        <table>
                            <tbody>
                                <tr>
                                    <th>Bot :</th>
                                    <td class="range">
                                        <input id="inputBot" type="range" min="0" max="1" value="${configuration.bot}">
                                    </td>
                                </tr>
                                <tr>
                                    <th>Bot Start :</th>
                                    <td class="range">
                                        <input id="inputBotStart" class="max" type="number" min="250" max="500" value="${configuration.botStart}" disabled>
                                        <input id="rangeBotStart" type="range" min="250" max="2000" value="${configuration.botStart}">
                                    </td>
                                </tr>
                                <tr>
                                    <th>Bot Random Start :</th>
                                    <td class="range">
                                        <input id="inputBotRandomStart" class="max" type="number" min="0" max="500" value="${configuration.botRandomStart}" disabled>
                                        <input id="rangeBotRandomStart" type="range" min="0" max="500" value="${configuration.botRandomStart}">
                                    </td>
                                </tr>
                                <tr>
                                    <th>Typing Speed :</th>
                                    <td class="range">
                                        <input id="inputTypingSpeed" class="max" type="number" min="50" max="300" value="${configuration.typingSpeed}" disabled>
                                        <input id="rangeTypingSpeed" type="range" min="50" max="500" value="${configuration.typingSpeed}">
                                    </td>
                                </tr>
                                <tr>
                                    <th>Typing Speed Randomness :</th>
                                    <td class="range">
                                        <input id="inputTypingRandom" class="max" type="number" min="0" max="300" value="${configuration.typingRandom}" disabled>
                                        <input id="rangeTypingRandom" type="range" min="0" max="300" value="${configuration.typingRandom}">
                                    </td>
                                </tr>
                                <tr>
                                    <th>Fail percentage by letter :</th>
                                    <td class="range">
                                        <input id="inputFailByLetter" class="max" type="number" min="0" max="75" value="${configuration.failByLetter}" disabled>
                                        <input id="rangeFailByLetter" type="range" min="0" max="75" value="${configuration.failByLetter}">
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                `).insertAfter('.tutorial');

                jQuery('#inputBot').on('change', function () {
                    configuration.bot = parseInt(jQuery(this).val());
                    localStorage.setItem('BombpartyConfiguration', JSON.stringify(configuration));
                });

                jQuery('#rangeBotStart').on('change', function () {
                    const val = jQuery(this).val();
                    configuration.botStart = parseInt(val);
                    jQuery('#inputBotStart').val(val);
                    localStorage.setItem('BombpartyConfiguration', JSON.stringify(configuration));
                });

                jQuery('#rangeBotRandomStart').on('change', function () {
                    const val = jQuery(this).val();
                    configuration.botRandomStart = parseInt(val);
                    jQuery('#inputBotRandomStart').val(val);
                    localStorage.setItem('BombpartyConfiguration', JSON.stringify(configuration));
                });

                jQuery('#rangeTypingSpeed').on('change', function () {
                    const val = jQuery(this).val();
                    configuration.typingSpeed = parseInt(val);
                    jQuery('#inputTypingSpeed').val(val);
                    localStorage.setItem('BombpartyConfiguration', JSON.stringify(configuration));
                });

                jQuery('#rangeTypingRandom').on('change', function () {
                    const val = jQuery(this).val();
                    configuration.typingRandom = parseInt(val);
                    jQuery('#inputTypingRandom').val(val);
                    localStorage.setItem('BombpartyConfiguration', JSON.stringify(configuration));
                });

                jQuery('#rangeFailByLetter').on('change', function () {
                    const val = jQuery(this).val();
                    configuration.failByLetter = parseInt(val);
                    jQuery('#inputFailByLetter').val(val);
                    localStorage.setItem('BombpartyConfiguration', JSON.stringify(configuration));
                });

                const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V'];
                const keyMap = {
                    en: {
                        A: ['Z', 'S', 'Q'],
                        B: ['V', 'F', 'G', 'H', 'N'],
                        C: ['X', 'S', 'D', 'F', 'V'],
                        D: ['X', 'S', 'Z', 'E', 'R', 'F', 'V', 'C'],
                        E: ['Z', 'S', 'D', 'F', 'R'],
                        F: ['C', 'D', 'E', 'R', 'T', 'G', 'B', 'V'],
                        G: ['V', 'F', 'R', 'T', 'Y', 'H', 'N', 'B'],
                        H: ['G', 'T', 'Y', 'U', 'J', 'N', 'B'],
                        I: ['U', 'J', 'K', 'L', 'O'],
                        J: ['N', 'H', 'Y', 'U', 'I', 'K'],
                        K: ['J', 'U', 'I', 'O', 'L'],
                        L: ['K', 'I', 'O', 'P', 'M'],
                        M: ['L', 'O', 'P'],
                        N: ['B', 'G', 'H', 'J'],
                        O: ['I', 'K', 'L', 'M', 'P'],
                        P: ['O', 'L', 'M'],
                        Q: ['A', 'Z', 'S', 'X', 'W'],
                        R: ['E', 'D', 'F', 'G', 'T'],
                        S: ['A', 'Z', 'E', 'D', 'C', 'X', 'W', 'Q'],
                        T: ['R', 'F', 'G', 'H', 'Y'],
                        U: ['Y', 'H', 'J', 'K', 'I'],
                        V: ['C', 'D', 'F', 'G', 'B'],
                        W: ['Q', 'S', 'X'],
                        X: ['W', 'Q', 'S', 'D', 'C'],
                        Y: ['T', 'G', 'H', 'J', 'U'],
                        Z: ['A', 'Q', 'S', 'D', 'E']
                    },
                    fr: {
                        A: ['Z', 'S', 'Q'],
                        B: ['V', 'F', 'G', 'H', 'N'],
                        C: ['X', 'S', 'D', 'F', 'V'],
                        D: ['X', 'S', 'Z', 'E', 'R', 'F', 'V', 'C'],
                        E: ['Z', 'S', 'D', 'F', 'R'],
                        F: ['C', 'D', 'E', 'R', 'T', 'G', 'B', 'V'],
                        G: ['V', 'F', 'R', 'T', 'Y', 'H', 'N', 'B'],
                        H: ['G', 'T', 'Y', 'U', 'J', 'N', 'B'],
                        I: ['U', 'J', 'K', 'L', 'O'],
                        J: ['N', 'H', 'Y', 'U', 'I', 'K'],
                        K: ['J', 'U', 'I', 'O', 'L'],
                        L: ['K', 'I', 'O', 'P', 'M'],
                        M: ['L', 'O', 'P'],
                        N: ['B', 'G', 'H', 'J'],
                        O: ['I', 'K', 'L', 'M', 'P'],
                        P: ['O', 'L', 'M'],
                        Q: ['A', 'Z', 'S', 'X', 'W'],
                        R: ['E', 'D', 'F', 'G', 'T'],
                        S: ['A', 'Z', 'E', 'D', 'C', 'X', 'W', 'Q'],
                        T: ['R', 'F', 'G', 'H', 'Y'],
                        U: ['Y', 'H', 'J', 'K', 'I'],
                        V: ['C', 'D', 'F', 'G', 'B'],
                        W: ['Q', 'S', 'X'],
                        X: ['W', 'Q', 'S', 'D', 'C'],
                        Y: ['T', 'G', 'H', 'J', 'U'],
                        Z: ['A', 'Q', 'S', 'D', 'E']
                    }
                };
                let currentlyTyping = 0;
                let used_words = [];

                const type = (string, length = 1) => {
                    if (length <= string.length) {
                        if (length < string.length && Math.random() <= (configuration.failByLetter / 100)) {
                            socket.emit('setWord', string.slice(0, length) + keyMap[rules.dictionaryId.value][string[length - 1]][Math.floor(Math.random() * keyMap[rules.dictionaryId.value][string[length - 1]].length)], false);
                            currentlyTyping = setTimeout(type.bind(null, string, length), configuration.typingSpeed + (Math.random() * configuration.typingRandom));
                        } else {
                            socket.emit('setWord', string.slice(0, length), string.length === length);
                            currentlyTyping = setTimeout(type.bind(null, string, length + 1), configuration.typingSpeed + (Math.random() * configuration.typingRandom));
                        }
                    }
                };

                const typeRandom = () => {
                    const syllable = milestone.syllable.toUpperCase();
                    const current_letters = letters.filter((l) => !(milestone.playerStatesByPeerId[selfPeerId].bonusLetters.map((bl) => bl.toUpperCase())).includes(l));
                    const current_words = words[rules.dictionaryId.value].filter((w) => !used_words.includes(w) && w.indexOf(syllable) !== -1);
                    const current_words_bonus = current_words.filter((w) => current_letters.some((l) => w.indexOf(l) !== -1));
                    const current_words_bonus_start_or_end = current_words_bonus.filter((w) => {
                        const i = w.indexOf(syllable);
                        return i === 0 || (w.length - syllable.length) - 1 === 0;
                    });
                    const current_words_bonus_start_or_end_less = current_words_bonus_start_or_end.filter((w) => w.length <= 8);

                    if (current_words_bonus_start_or_end_less.length) {
                        type(current_words_bonus_start_or_end_less[Math.floor(Math.random() * current_words_bonus_start_or_end_less.length)]);
                    }
                    else if (current_words_bonus_start_or_end.length) {
                        type(current_words_bonus_start_or_end[Math.floor(Math.random() * current_words_bonus_start_or_end.length)]);
                    }
                    else if (current_words_bonus.length) {
                        type(current_words_bonus[Math.floor(Math.random() * current_words_bonus.length)]);
                    }
                    else if (current_words.length) {
                        type(current_words[Math.floor(Math.random() * current_words.length)]);
                    }
                };

                const typeRandomBot = () => {
                    setTimeout(() => typeRandom(), configuration.botStart + (Math.random() * configuration.botRandomStart));
                };

                const resetTyping = () => {
                    clearTimeout(currentlyTyping);
                    currentlyTyping = 0;
                };

                jQuery(document).unbind('keydown');
                jQuery(document).keydown((ev) => {
                    if (!milestone) {
                        return;
                    }

                    if (ev.code !== 'ShiftRight') {
                        return;
                    }

                    if (currentlyTyping) {
                        return;
                    }

                    if (milestone.currentPlayerPeerId === selfPeerId) {
                        typeRandom();
                    }
                });

                socket.on('failWord', (peerId) => {
                    resetTyping();
                    used_words.push(milestone.playerStatesByPeerId[peerId].word.toUpperCase());
                    if (peerId === selfPeerId) {
                        if (configuration.bot) {
                            typeRandomBot();
                        }
                    }
                });

                socket.on('nextTurn', (peerId) => {
                    resetTyping();
                    if (peerId === selfPeerId) {
                        if (configuration.bot) {
                            typeRandomBot();
                        }
                    }
                });

                socket.on('correctWord', (correctWord) => {
                    resetTyping();
                    used_words.push(milestone.playerStatesByPeerId[correctWord.playerPeerId].word.toUpperCase());
                });

                socket.on('setMilestone', () => {
                    resetTyping();
                    used_words = [];
                });
            });
        }
    });
});
