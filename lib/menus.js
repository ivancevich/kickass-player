'use strict';

var inquirer = require('inquirer');

var ACTIONS = {
  SOMETHING_RANDOM: 'Listen to something random',
  SEARCH_MUSIC: 'Search music',
  BACK: 'back',
  QUIT: 'Quit'
};

module.exports = {
  whatToDo: whatToDo,
  askForSearch: askForSearch,
  askForSelection: askForSelection
};

function whatToDo(methods) {
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
  })
  .then(function (answer) {
    switch (answer.action) {
      case ACTIONS.SOMETHING_RANDOM:
        methods.search();
        break;
      case ACTIONS.SEARCH_MUSIC:
        methods.askForSearch();
        break;
      case ACTIONS.QUIT:
        methods.quit();
        break;
      default:
        console.error('Invalid action');
    }
  });
}

function askForSearch(methods) {
  inquirer.prompt({
    type: 'input',
    name: 'search',
    message: 'Enter your search ("back" to go back):'
  })
  .then(function (answer) {
    if (answer.search === ACTIONS.BACK) {
      methods.init();
      return;
    }
    methods.search(answer.search);
  });
}

function askForSelection(options, message, methods) {
  var choices = options.map(function mapOptions(o, i) {
    return {
      name: o.name,
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
    name: 'option',
    message: message || 'Select an option',
    choices: choices
  })
  .then(function (answer) {
    if (answer.option === ACTIONS.BACK) {
      methods.init();
      return;
    }
    methods.callback(null, options[answer.option], options);
  });
}
