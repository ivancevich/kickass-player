'use strict';

var inquirer = require('inquirer');
var player = require('./lib/player');
var kickass = require('./lib/kickass');
var streamer = require('./lib/streamer');

var ACTIONS = {
  SOMETHING_RANDOM: 'Listen to something random',
  SEARCH_MUSIC: 'Search music',
  BACK: 'back',
  QUIT: 'Quit'
};

init();

function init() {
  inquirer.prompt({
    type: 'list',
    name: 'action',
    message: 'What do you wanna do:',
    choices: [
      ACTIONS.SOMETHING_RANDOM,
      ACTIONS.SEARCH_MUSIC,
      new inquirer.Separator(),
      ACTIONS.QUIT
    ]
  }, function (answer) {
    switch (answer.action) {
      case ACTIONS.SOMETHING_RANDOM:
        search();
        break;
      case ACTIONS.SEARCH_MUSIC:
        askForSearch();
        break;
      case ACTIONS.QUIT:
        process.exit(0);
        break;
      default:
        console.error('Invalid action');
    }
  });
}

function askForSearch() {
  inquirer.prompt({
    type: 'input',
    name: 'search',
    message: 'Enter your search ("back" to go back):'
  }, function (answer) {
    if (answer.search === ACTIONS.BACK) {
      init();
      return;
    }
    search(answer.search);
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
    console.error(err);
    return;
  }
  selectTorrent(results, streamTorrent);
}

function selectTorrent(torrents, callback) {
  var choices = torrents.map(function mapTorrents(t, i) {
    return {
      name: t.name,
      value: i
    };
  });
  choices.push(new inquirer.Separator());
  choices.push({
    name: 'Go back',
    value: ACTIONS.BACK
  });
  choices.push(new inquirer.Separator());

  inquirer.prompt({
    type: 'list',
    name: 'torrent',
    message: 'Select a torrent',
    default: 'index',
    choices: choices
  }, function (answer) {
    if (answer.torrent === ACTIONS.BACK) {
      init();
      return;
    }
    callback(null, torrents[answer.torrent]);
  });
}

function streamTorrent(err, torrent) {
  if (err) {
    console.error(err);
    return;
  }
  streamer.start(torrent, onSongsResults);
}

function onSongsResults(err, files) {
  if (err) {
    console.error(err);
    return;
  }
  selectSong(files, playSong);
}

function selectSong(songs, callback) {
  var choices = songs.map(function mapSongs(s, i) {
    return {
      name: s.name,
      value: i
    };
  });
  choices.push(new inquirer.Separator());
  choices.push({
    name: 'Go back',
    value: ACTIONS.BACK
  });
  choices.push(new inquirer.Separator());

  inquirer.prompt({
    type: 'list',
    name: 'song',
    message: 'Select a song',
    default: 'index',
    choices: choices
  }, function (answer) {
    if (answer.song === ACTIONS.BACK) {
      init();
      return;
    }
    callback(null, songs[answer.song]);
  });
}

function playSong(err, song) {
  if (err) {
    console.error(err);
    return;
  }
  player.play([song]);
}
