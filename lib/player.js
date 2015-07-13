'use strict';

var EventEmitter = require('events').EventEmitter;
var Batch = require('batch');
var lame = require('lame');
var Speaker = require('speaker');

var EVENTS = {
  STARTED: 'started',
  FINISHED: 'finished'
};

module.exports = {
  play: play,
  events: EVENTS
};

function play(songs) {
  if (!songs || (Array.isArray(songs) && songs.length === 0)) {
    throw 'Player.play needs songs.';
  }
  var ee = new EventEmitter();
  var batch = new Batch();
  batch.concurrency(1);

  if (Array.isArray(songs)) {
    songs.forEach(walkSongs);
  } else {
    walkSongs(songs);
  }

  batch.end();
  return ee;

  function walkSongs(song) {
    batch.push(songPlayer);

    function songPlayer(done) {
      var decoder = new lame.Decoder();
      var speaker = new Speaker();
      speaker
        .on('open', function () {
          ee.emit(EVENTS.STARTED, song);
        })
        .on('close', function () {
          ee.emit(EVENTS.FINISHED, song);
          done();
        });
      song.stream
        .pipe(decoder)
        .pipe(speaker);
    }
  }
}
