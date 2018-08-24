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
        $('#SettingsTab').append('<h2>Cambridge</h2>');
        $('#SettingsTab').append('<table><tbody><tr><td><kbd>+</kbd> to type a word rapidly like a human.</td></tr></tbody></table>');
        $('#SettingsTab').append('<table><tbody><tr><td><kbd>-</kbd> to type a slowly like an alien.</td></tr></tbody></table>');

        $(document).keypress(function(e) {
            console.log(e.which);
            switch(e.which) {
                case 43:
                    console.log('+');
                    break;
                case 45:
                    console.log('-');
                    break;
            }
        });
    }, 5000);


    /* channel.socket.on("wordRoot", function (a) {
         console.log(a.toUpperCase());
     });*/
});