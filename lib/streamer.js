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
    var files = engine.files
      .filter(function (file) {
        return file.name.indexOf('.mp3') !== -1;
      })
      .map(function (file) {
        return {
          name: file.name,
          stream: file.createReadStream()
        };
      });
    callback(null, files);
  });
}
