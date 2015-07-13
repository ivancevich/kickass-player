'use strict';

var Batch = require('batch');
var lame = require('lame');
var Speaker = require('speaker');

module.exports = {
  play: play
};

function play(songs) {
  if (!songs || songs.length === 0) {
    throw 'Player.play needs songs.';
  }
  var batch = new Batch();
  batch.concurrency(1);
  songs.forEach(walkSongs);
  batch.end();

  function walkSongs(song) {
    batch.push(songPlayer);

    function songPlayer(done) {
      var decoder = new lame.Decoder();
      var speaker = new Speaker();
      speaker
        .on('open', function () {
          console.log('now playing', song.name);
        })
        .on('close', function () {
          done();
        });
      song.stream
        .pipe(decoder)
        .pipe(speaker);
    }
  }
}
