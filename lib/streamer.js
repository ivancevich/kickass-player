'use strict';
var torrentStream = require('torrent-stream');

function Streamer() {}

Streamer.prototype.start = function(torrent, callback) {
    if (!torrent || !torrent.name || !torrent.magnet) throw 'Streamer.start needs a torrent.';
    console.log('starting to stream', torrent.name);
    var engine = torrentStream(torrent.magnet);
    engine.on('ready', function() {
        var files = engine.files
            .filter(function(file) {
                return file.name.indexOf('.mp3') !== -1;
            })
            .map(function(file) {
                return {
                    name: file.name,
                    stream: file.createReadStream()
                };
            });
        callback(null, files);
    });
};

module.exports = new Streamer();
