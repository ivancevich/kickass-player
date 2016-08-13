'use strict';

var request = require('request');
var cheerio = require('cheerio');

module.exports = {
  search: search
};

function search(options, callback) {
  if (!options || (!options.query && !options.category)) {
    throw 'Kickass.search needs options.';
  }
  var url;
  if (!options.query) {
    url = encodeURI('https://dx-torrent.com/' + options.category + '/');
  } else {
    url = encodeURI('https://dx-torrent.com/usearch/' + options.query + ' category:' + options.category + '/');
  }
  request({
    uri: url,
    gzip: true
  }, onKickstartLoaded);

  function onKickstartLoaded(err, res, body) {
    if (err || res.statusCode !== 200) {
      callback(err || new Error('Status code was not 200'));
      return;
    }
    var $ = cheerio.load(body);
    var results = [];
    $('tr:nth-of-type(n+2) td:nth-of-type(1)').each(function (i, element) {
      var $element = $(element);
      results.push({
        name: $element.find('a.cellMainLink').text(),
        magnet: getMagnet($element.find('[data-sc-params]').attr('data-sc-params'))
      });
    });
    callback(null, results || []);
  }

  function getMagnet(params) {
    if (!params) return '';
    try {
      var json = JSON.parse(params.replace(new RegExp('\'', 'g'), '"'));
      return json.magnet;
    } catch (exception) {
      return '';
    }
  }
}
