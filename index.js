'use strict';

var menus = require('./lib/menus');
var player = require('./lib/player');
var kickass = require('./lib/kickass');
var streamer = require('./lib/streamer');

module.exports = {
  init: init
};

function init() {
  menus.whatToDo({
    quit: quit,
    search: search,
    askForSearch: askForSearch
  });
}

function quit() {
  process.exit(0);
}

function askForSearch() {
  menus.askForSearch({
    init: init,
    search: search
  });
}

function search(query) {
  kickass.search({
    query: query,
    category: 'music'
  }, onKickassResults);
}

function onKickassResults(err, results) {
  if (err) {
    onError(err);
    return;
  }
  selectTorrent(results, getTorrentSongs);
}

function selectTorrent(torrents, callback) {
  menus.askForSelection(torrents, 'Select a torrent', {
    init: init,
    callback: callback
  });
}

function getTorrentSongs(err, torrent) {
  if (err) {
    onError(err);
    return;
  }
  streamer.start(torrent, onSongsResults);
}

function onSongsResults(err, files) {
  if (err) {
    onError(err);
    return;
  }
  selectSong(files, playSong);
}

function selectSong(songs, callback) {
  menus.askForSelection(songs, 'Select a song', {
    init: init,
    callback: callback
  });
}

function playSong(err, song, songs) {
  if (err) {
    onError(err);
    return;
  }
  player
    .play(song)
    .on(player.events.STARTED, function ( /* song */ ) {
      // console.log('started playing %s', song.name);
    })
    .on(player.events.FINISHED, function ( /* song */ ) {
      // console.log('finished playing %s', song.name);
      selectSong(songs, playSong);
    });
}

function onError(err) {
  console.error(err);
  init();
}
