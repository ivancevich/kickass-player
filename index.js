'use strict';
var player = require('./lib/player');
var kickass = require('./lib/kickass');
var streamer = require('./lib/streamer');

var query = process.argv[2];

function getOne(array) {
    if (query) {
        return array[0];
    }
    var i = Math.floor(Math.random() * (array.length));
    return array[i];
}

kickass.search({
    query: query,
    category: 'music'
}, function(err, results) {
    if (err) return console.error(err);
    streamer.start(getOne(results), function(err, files) {
        if (err) return console.error(err);
        player.play(files);
    });
});
