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
// ==/UserScript==

$(document).ready(function () {
    setTimeout(function () {
        $.ajax({
            url: 'https://raw.githubusercontent.com/yerffeog/cambridge/master/fr-FR.js',
            dataType: 'json',
            success: function (dictionary) {
                $('#SettingsTab').append('<h2>Cambridge</h2>');
                $('#SettingsTab').append('<table><tbody><tr><td><button id="CambridgeGame">Game</button></td></tr></tbody></table>');
                $('#SettingsTab').append('<table><tbody><tr><td><button id="CambridgeChat">Chat</button></td></tr></tbody></table>');

                channel.socket.on("wordRoot", function (a) {
                    channel.data.wordRoot = a.toUpperCase();
                });

                $('#CambridgeGame').on('click', function (e) {
                    e.preventDefault();
                    if (channel.data.actors.length) {
                        if (app.user.authId === channel.data.actors[channel.data.activePlayerIndex].authId) {
                            var word = dictionary.find(function (current) {
                                return current.indexOf(channel.data.wordRoot) !== -1 && channel.data.actorsByAuthId[app.user.authId].lockedLetters.findIndex(function (letter) {
                                    return current.indexOf(letter);
                                }) !== -1;
                            });

                            if (word) {
                                type(word, 1);
                            }
                        }
                    }
                });

                $('#CambridgeChat').on('click', function (e) {
                    e.preventDefault();
                    if (channel.data.actors.length) {
                        if (app.user.authId === channel.data.actors[channel.data.activePlayerIndex].authId) {
                            var word = dictionary.find(function (current) {
                                return current.indexOf(channel.data.wordRoot) !== -1;
                            });

                            if (word) {
                                channel.socket.emit("chatMessage", word);
                            }
                        }
                    }
                });

                function type(string, length) {
                    if (length < string.length + 1) {
                        channel.socket.emit("setWord", { word: string.slice(0, length), validate: string.length === length });
                        setTimeout(type.bind(null, string, length + 1), 50 + Math.random() * 11);
                    }
                }
            }
        });
    }, 5000);
});