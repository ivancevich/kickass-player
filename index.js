'use strict';
var player = require('./lib/player');
var kickass = require('./lib/kickass');
var streamer = require('./lib/streamer');

function getRandom(array) {
    var i = Math.floor(Math.random() * (array.length));
    return array[i];
}

kickass.search({
    query: process.argv[2],
    category: 'music'
}, function(err, results) {
    if (err) return console.error(err);
    streamer.start(getRandom(results), function(err, files) {
        if (err) return console.error(err);
        player.play(files);
    });
});
