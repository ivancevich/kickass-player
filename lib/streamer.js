'use strict';

var torrentStream = require('torrent-stream');

module.exports = {
  start: start
};

function start(torrent, callback) {
  if (!torrent || !torrent.name || !torrent.magnet) {
    throw 'Streamer.start needs a torrent.';
  }
  var engine = torrentStream(torrent.magnet);
  engine.on('ready', function () {
    var files = engine.files.filter(onlyMP3s);

    function onlyMP3s(file) {
      var MP3 = '.mp3';
      return file.name.indexOf(MP3) === file.name.length - MP3.length;
    }
    callback(null, files);
  });
}
