'use strict';
var player = require('./lib/player');
var kickass = require('./lib/kickass');
var streamer = require('./lib/streamer');

kickass.search({
    query: process.argv[2],
    category: 'music'
}, function(err, results) {
    if (err) return console.error(err);
    streamer.start(results[0], function(err, files) {
        if (err) return console.error(err);
        player.play(files);
    });
});
