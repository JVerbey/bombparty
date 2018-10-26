// ==UserScript==
// @name        BombParty
// @namespace   Iterer
// @description A bombparty simple cheat.
// @author      Geoffrey Migliacci
// @version     0.1
// @encoding    utf-8
// @license     https://raw.githubusercontent.com/yerffeog/BombParty/master/LICENSE
// @icon        https://github.com/yerffeog/BombParty/raw/master/BombParty.png
// @homepage    https://github.com/yerffeog/BombParty
// @supportURL  https://github.com/yerffeog/BombParty/issues
// @updateURL   https://raw.githubusercontent.com/yerffeog/BombParty/master/BombParty.js
// @downloadURL https://raw.githubusercontent.com/yerffeog/BombParty/master/BombParty.js
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
                url: 'https://raw.githubusercontent.com/yerffeog/BombParty/master/fr-FR.js',
                cache: true,
                dataType: 'json',
                success: function (dictionary) {
                    var USED_WORDS = localStorage.getItem('UsedBombParty') === null ? [] : JSON.parse(localStorage.getItem('UsedBombParty'));
                    USED_WORDS = USED_WORDS.filter(function (value, index, self) {
                        return self.indexOf(value) === index;
                    });
                    var FAIL_WORDS = localStorage.getItem('FailBombParty') === null ? [] : JSON.parse(localStorage.getItem('FailBombParty'));
                    FAIL_WORDS = FAIL_WORDS.filter(function (value, index, self) {
                        return self.indexOf(value) === index;
                    });

                    var AUTOMATE = false;
                    var PLAYERS_WORDS = {};

                    Object.keys(channel.data.actorsByAuthId).forEach(function (e) {
                        PLAYERS_WORDS[e] = "";
                    });

                    //42["winWord",{"playerAuthId":"guest:43456"}]
                    //42["failWord",{"playerAuthId":"guest:43432"}]
                    $('#SettingsTab').append('<h2>Bot</h2>');
                    $('#SettingsTab').append('<table><tbody><tr><td><button id="BombPartyGame">Game</button></td></tr></tbody></table>');
                    $('#SettingsTab').append('<table><tbody><tr><td><button id="BombPartyChat">Chat</button></td></tr></tbody></table>');
                    $('#SettingsTab').append('<h2>Automatic</h2>');
                    $('#SettingsTab').append('<table><tbody><tr><td><button id="BombPartyAutomate">OFF</button></td></tr></tbody></table>');

                    //42["addActor",{"authId":"guest:44270","displayName":"Guest 44270","state":"alive","lives":2,"lastWord":"","wordRoot":"","lockedLetters":["a","b","c","d","e","f","g","h","i","j","l","m","n","o","p","q","r","s","t","u","v"]}]
                    channel.socket.on('addActor', function (a) {
                        PLAYERS_WORDS[a.authId] = "";
                        console.log(PLAYERS_WORDS);
                    });

                    channel.socket.on('setWord', function (a) {
                        PLAYERS_WORDS[a.playerAuthId] = a.word.toUpperCase();
                        console.log(PLAYERS_WORDS[a.playerAuthId]);
                    });

                    channel.socket.on('winWord', function (a) {
                        USED_WORDS.push(PLAYERS_WORDS[a.playerAuthId]);
                        localStorage.setItem('UsedBombParty', JSON.stringify(USED_WORDS));
                    });

                    channel.socket.on('failWord', function (a) {
                        FAIL_WORDS.push(PLAYERS_WORDS[a.playerAuthId]);
                        console.log('Fails');
                        console.log(FAIL_WORDS);
                        localStorage.setItem('FailBombParty', JSON.stringify(FAIL_WORDS));
                    });

                    channel.socket.on('failWord', function (a) {
                        if (AUTOMATE) {
                            if (app.user.authId === a.playerAuthId) {
                                setTimeout(function () {
                                    var WORDS = dictionary.filter(function (a) {
                                        return a.indexOf(channel.data.wordRoot) !== -1;
                                    }).filter(function (a) {
                                        return USED_WORDS.indexOf(a) === -1;
                                    }).filter(function (a) {
                                        return FAIL_WORDS.indexOf(a) === -1;
                                    });

                                    /*var WORDS_STARTING = WORDS.filter(function (a) {
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
                                    });*/

                                    if (WORDS.length) {
                                        type(WORDS[Math.floor(Math.random() * WORDS.length)], 1);
                                    }

                                }, 1);
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
                                        }).filter(function (a) {
                                            return USED_WORDS.indexOf(a) === -1;
                                        }).filter(function (a) {
                                            return FAIL_WORDS.indexOf(a) === -1;
                                        });
    
                                        if (WORDS.length) {
                                            type(WORDS[Math.floor(Math.random() * WORDS.length)], 1);
                                        }

                                    }, 1);
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

                    function type(string, length) {
                        channel.socket.emit("setWord", { word: string, validate: true });
                        /*if (length < string.length + 1) {
                            channel.socket.emit("setWord", { word: string.length < length && (Math.random() * 101) < 10 ? string.slice(0, length) + String.fromCharCode(Math.floor(Math.random() * 26) + 97).toUpperCase() : string.slice(0, length), validate: string.length === length });
                            setTimeout(type.bind(null, string, length + 1), 100 + Math.random() * 31);
                        }*/
                    }
                }
            });

            $(document).unbind('keypress');
        }
    }
});