// ==UserScript==
// @name        BombParty
// @namespace   Iterer
// @description A bombparty simple cheat.
// @author      Geoffrey Migliacci
// @version     0.1
// @encoding    utf-8
// @license     https://raw.githubusercontent.com/myerffoeg/bombparty/master/LICENSE.md
// @icon        https://github.com/myerffoeg/bombparty/raw/master/BombParty.png
// @homepage    https://github.com/myerffoeg/bombparty
// @supportURL  https://github.com/myerffoeg/bombparty/issues
// @updateURL   https://github.com/myerffoeg/bombparty/raw/master/BombParty.user.js
// @downloadURL https://github.com/myerffoeg/bombparty/raw/master/BombParty.user.js
// @match       http://bombparty.sparklinlabs.com/play/*
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant       none
// @run-at      document-idle
// ==/UserScript==

$(document).on('keypress', function (e) {
    console.log('BombParty loaded');
    if (channel.hasOwnProperty('data')) {
        if (e.which === 178) {
            $.ajax({
                method: 'GET',
                url: 'https://raw.githubusercontent.com/myerffoeg/bombparty/master/fr-FR.json',
                cache: true,
                dataType: 'json',
                success: function (dictionary) {
                    var AUTOMATE = false;

                    function type(string, length) {
                        if (length < string.length + 1) {
                            channel.socket.emit("setWord", { word: string.length < length && (Math.random() * 101) < 10 ? string.slice(0, length) + String.fromCharCode(Math.floor(Math.random() * 26) + 97).toUpperCase() : string.slice(0, length), validate: string.length === length });
                            setTimeout(type.bind(null, string, length + 1), 130 + Math.random() * 41);
                        }
                    }
                    
                    $('#SettingsTab').append('<h2>Bot</h2>');
                    $('#SettingsTab').append('<table><tbody><tr><td><button id="BombPartyGame">Game</button></td></tr></tbody></table>');
                    $('#SettingsTab').append('<table><tbody><tr><td><button id="BombPartyChat">Chat</button></td></tr></tbody></table>');
                    $('#SettingsTab').append('<h2>Automatic</h2>');
                    $('#SettingsTab').append('<table><tbody><tr><td><button id="BombPartyAutomate">OFF</button></td></tr></tbody></table>');

                    channel.socket.on('addActor', function (a) {

                    });

                    channel.socket.on('setWord', function (a) {

                    });

                    channel.socket.on('failWord', function (a) {
                        if (AUTOMATE) {
                            if (app.user.authId === a.playerAuthId) {
                                setTimeout(function () {
                                    var WORDS = dictionary.filter(function (a) {
                                        return a.indexOf(channel.data.wordRoot) !== -1;
                                    });

                                    if (WORDS.length) {
                                        type(WORDS[Math.floor(Math.random() * WORDS.length)], 1);
                                    }

                                }, 2000 + Math.floor(Math.random() * 900) + 100);
                            }
                        }
                    });

                    channel.socket.on('setActivePlayerIndex', function (a) {
                        if (AUTOMATE) {
                            if (channel.data.actors.length) {
                                if (app.user.authId === channel.data.actors[a].authId) {
                                    setTimeout(function () {
                                        var WORDS = dictionary.filter(function (a) {
                                            return a.indexOf(channel.data.wordRoot) !== -1;
                                        });
    
                                        var WORDS_STARTING = WORDS.filter(function (a) {
                                            return a.indexOf(channel.data.wordRoot) === 0;
                                        });
    
                                        var WORDS_HEART = WORDS.filter(function (a) {
                                            return channel.data.actorsByAuthId[app.user.authId].lockedLetters.map(function (a) {
                                                return a.toUpperCase();
                                            }).findIndex(function (b) {
                                                return a.indexOf(b) !== -1;
                                            }) !== -1;
                                        });
    
                                        var WORDS_STARTING_HEART = WORDS_STARTING.filter(function (a) {
                                            return channel.data.actorsByAuthId[app.user.authId].lockedLetters.map(function (a) {
                                                return a.toUpperCase();
                                            }).findIndex(function (b) {
                                                return a.indexOf(b) !== -1;
                                            }) !== -1;
                                        });
    
                                        if (WORDS_STARTING_HEART.length) {
                                            type(WORDS_STARTING_HEART[Math.floor(Math.random() * WORDS_STARTING_HEART.length)], 1);
                                        }
                                        else if (WORDS_STARTING.length) {
                                            type(WORDS_STARTING[Math.floor(Math.random() * WORDS_STARTING.length)], 1);
                                        }
                                        else if (WORDS_HEART.length) {
                                            type(WORDS_HEART[Math.floor(Math.random() * WORDS_HEART.length)], 1);
                                        }
                                        else if (WORDS.length) {
                                            type(WORDS[Math.floor(Math.random() * WORDS.length)], 1);
                                        }

                                    }, 1100 + Math.floor(Math.random() * 500) + 50);
                                }
                            }
                        }
                    });

                    channel.socket.on('wordRoot', function (a) {
                        channel.data.wordRoot = a.toUpperCase();
                    });

                    $('#BombPartyAutomate').on('click', function (e) {
                        e.preventDefault();
                        AUTOMATE = !AUTOMATE;
                        $('#BombPartyAutomate').html(AUTOMATE ? 'ON' : 'OFF');
                    });

                    $('#BombPartyGame').on('click', function (e) {
                        e.preventDefault();
                        if (channel.data.actors.length) {
                            if (app.user.authId === channel.data.actors[channel.data.activePlayerIndex].authId) {

                                var WORDS = dictionary.filter(function (a) {
                                    return a.indexOf(channel.data.wordRoot) !== -1;
                                });

                                if (WORDS.length) {
                                    type(WORDS[Math.floor(Math.random() * WORDS.length)], 1);
                                }
                            }
                        }
                    });

                    $('#BombPartyChat').on('click', function (e) {
                        e.preventDefault();

                        var WORDS = dictionary.filter(function (a) {
                            return a.indexOf(channel.data.wordRoot) !== -1;
                        });
                        
                        if (WORDS.length) {
                            channel.socket.emit("chatMessage", WORDS[Math.floor(Math.random() * WORDS.length)]);
                        }
                    });
                }
            });

            $(document).unbind('keypress');
        }
    }
});