'use strict';
var Batch = require('batch');
var lame = require('lame');
var Speaker = require('speaker');

function Player() {}

Player.prototype.play = function(songs) {
    if (!songs || songs.length === 0) throw 'Player.play needs songs.';
    var batch = new Batch();
    batch.concurrency(1);
    songs.forEach(function(song) {
        batch.push(function(done) {
            var decoder = new lame.Decoder();
            var speaker = new Speaker();
            speaker
                .on('open', function() {
                    console.log('now playing', song.name);
                })
                .on('close', function() {
                    done();
                });
            song.stream
                .pipe(decoder)
                .pipe(speaker);
        });
    });
    batch.end();
};

module.exports = new Player();
