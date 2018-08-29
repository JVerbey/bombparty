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

$(document).on('keypress', function (e) {
    if (channel.hasOwnProperty('data')) {
        if (e.which === 178) {
            $.ajax({
                method: 'GET',
                url: 'https://raw.githubusercontent.com/yerffeog/cambridge/master/fr-FR.js',
                cache: true,
                dataType: 'json',
                success: function (dictionary) {
                    var AUTOMATE = false;

                    $('#SettingsTab').append('<h2>Cambridge</h2>');
                    $('#SettingsTab').append('<table><tbody><tr><td><button id="CambridgeGame">Game</button></td></tr></tbody></table>');
                    $('#SettingsTab').append('<table><tbody><tr><td><button id="CambridgeChat">Chat</button></td></tr></tbody></table>');
                    $('#SettingsTab').append('<h2>Automatic</h2>');
                    $('#SettingsTab').append('<table><tbody><tr><td><button id="CambridgeAutomate">OFF</button></td></tr></tbody></table>');

                    channel.socket.on("failWord", function (a) {
                        if (app.user.authId === a.playerAuthId) {
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
                                } else if (WORDS.length) {
                                    type(WORDS[Math.floor(Math.random() * WORDS.length)], 1);
                                }

                            }, 200);
                        }
                    });

                    channel.socket.on("setActivePlayerIndex", function (a) {
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
                                        } else if (WORDS.length) {
                                            type(WORDS[Math.floor(Math.random() * WORDS.length)], 1);
                                        }

                                    }, 500 + Math.random() * 751);
                                }
                            }
                        }
                    });

                    channel.socket.on("wordRoot", function (a) {
                        channel.data.wordRoot = a.toUpperCase();
                    });

                    $('#CambridgeAutomate').on('click', function (e) {
                        e.preventDefault();
                        AUTOMATE = !AUTOMATE;
                        $('#CambridgeAutomate').html(AUTOMATE ? 'ON' : 'OFF');
                    });

                    $('#CambridgeGame').on('click', function (e) {
                        e.preventDefault();
                        if (channel.data.actors.length) {
                            if (app.user.authId === channel.data.actors[channel.data.activePlayerIndex].authId) {

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
                                } else if (WORDS.length) {
                                    type(WORDS[Math.floor(Math.random() * WORDS.length)], 1);
                                }
                            }
                        }
                    });

                    $('#CambridgeChat').on('click', function (e) {
                        e.preventDefault();

                        var WORDS = dictionary.filter(function (a) {
                            return a.indexOf(channel.data.wordRoot) !== -1;
                        });

                        var WORDS_STARTING = WORDS.filter(function (a) {
                            return a.indexOf(channel.data.wordRoot) === 0;
                        });

                        if (WORDS_STARTING.length) {
                            channel.socket.emit("chatMessage", WORDS_STARTING[Math.floor(Math.random() * WORDS_STARTING.length)]);
                        }
                        else if (WORDS.length) {
                            channel.socket.emit("chatMessage", WORDS[Math.floor(Math.random() * WORDS.length)]);
                        }
                    });

                    function type(string, length) {
                        if (length < string.length + 1) {
                            channel.socket.emit("setWord", { word: string.slice(0, length), validate: string.length === length });
                            setTimeout(type.bind(null, string, length + 1), 90 + Math.random() * 31);
                        }
                    }
                }
            });

            $(document).unbind('keypress');
        }
    }
});


/*function type(string, length) {
    if (length < string.length + 1) {
        //channel.socket.emit("setWord", { word: (Math.random() * 101)  < 15 ? string.slice(0, length) + String.fromCharCode(Math.floor(Math.random() * 26) + 97).toUpperCase() : string.slice(0, length), validate: string.length === length });

        if((Math.random() * 101)  < 15) {
            console.log(string.slice(0, length) + String.fromCharCode(Math.floor(Math.random() * 26) + 97).toUpperCase());
            setTimeout(type.bind(null, string, length + 1), 100 + Math.random() * 31);
        }
        else {
            console.log(string.slice(0, length));
            setTimeout(type.bind(null, string, length + 1), 80 + Math.random() * 31);
        }
    }
}
type('BONJOUR', 1);

String.fromCharCode(Math.floor(Math.random() * 26) + 97).toUpperCase();


var scr = document.createElement("script");
scr.src = "https://code.jquery.com/jquery-3.3.1.min.js";
document.body.appendChild(scr);

var array = [];
$( "#main_ul li" ).each(function( i ) {
    if($(this).text().trim().indexOf('-') === -1) {
        array.push($(this).text().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, "").toUpperCase());
    }
  });
JSON.stringify(array);


function unique(list) {
    var result = [];
    $.each(list, function(i, e) {
      if ($.inArray(e, result) == -1) result.push(e);
    });
    return result;
  }

var words = [];
$.ajax({
                method: 'GET',
                url: 'https://raw.githubusercontent.com/yerffeog/cambridge/master/fr-FR.js',
                cache: true,
                dataType: 'json',
                success: function (dictionary) {
                    words = unique(dictionary);
                    words = words.sort((a, b) => a.localeCompare(b));
                }
            });*/