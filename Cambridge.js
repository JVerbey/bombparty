// ==UserScript==
// @name        Cambridge
// @namespace   Iterer
// @version     0.1
// @description A bombparty simple cheat.
// @author      Geoffrey Migliacci
// @match       http://bombparty.sparklinlabs.com/
// @match       http://bombparty.sparklinlabs.com/play/*
// @match       http://hub.sparklinlabs.com/apps/BombParty/play/*
// @require     https://code.jquery.com/jquery-3.3.1.min.js
// @grant       unsafeWindow
// @run-at      document-idle
// ==/UserScript==

$(document).ready(function () {
    setTimeout(function () {
        $.ajax({
            url: 'https://raw.githubusercontent.com/yerffeog/cambridge/master/fr-FR.js',
            dataType: 'json',
            success: function (dictionary) {
                $('#SettingsTab').append('<h2>Cambridge</h2>');
                $('#SettingsTab').append('<table><tbody><tr><td><button id="CambridgeGame">Game</button></td></tr></tbody></table>');

                channel.socket.on("wordRoot", function (a) {
                    channel.data.wordRoot = a.toUpperCase();
                });

                $('#CambridgeGame').on('click', function (e) {
                    e.preventDefault();
                    if (channel.data.actors.length) {
                        if (app.user.authId === channel.data.actors[channel.data.activePlayerIndex].authId) {

                            var WORDS = dictionary.filter(function (a) {
                                return a.indexOf(channel.data.wordRoot) !== -1;
                            }).sort(function (a, b) {
                                return b.length - a.length;
                            });

                            var WORDS_HEART = WORDS_WITHOUT_LETTERS.filter(function (a) {
                                return channel.data.actorsByAuthId[app.user.authId].lockedLetters.findIndex(function (b) {
                                    return a.indexOf(b) !== -1;
                                }) !== -1;
                            }).sort(function (a, b) {
                                return b.length - a.length;
                            });

                            if (WORDS_HEART.length) {
                                type(WORDS_HEART[Math.floor(Math.random() * WORDS_HEART.length)], 1);
                            } else if (WORDS.length) {
                                type(WORDS[Math.floor(Math.random() * WORDS.length)], 1);
                            }
                        }
                    }
                });

                function type(string, length) {
                    if (length < string.length + 1) {
                        channel.socket.emit("setWord", { word: string.slice(0, length), validate: string.length === length });
                        setTimeout(type.bind(null, string, length + 1), 80 + Math.random() * 16);
                    }
                }
            }
        });
    }, 5000);
});