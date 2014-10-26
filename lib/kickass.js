'use strict';
var request = require('request');
var cheerio = require('cheerio');

function Kickass() {}

Kickass.prototype.search = function(options, callback) {
    if (!options || (!options.query && !options.category)) throw 'Kickass.search needs options.';
    var url;
    if (!options.query) {
        url = encodeURI('https://kickass.to/' + options.category + '/');
    } else {
        url = encodeURI('https://kickass.to/usearch/' + options.query + ' category:' + options.category + '/');
    }
    request({
        uri: url,
        gzip: true
    }, function(err, res, body) {
        if (err || res.statusCode !== 200) return callback(err || new Error('Status code was not 200'));
        var $ = cheerio.load(body);
        var results = [];
        $('tr:nth-of-type(n+2) td:nth-of-type(1)').each(function(i, element) {
            var $element = $(element);
            results.push({
                name: $element.find('a.cellMainLink').text(),
                magnet: $element.find('a.imagnet').attr('href')
            });
        });
        callback(null, results || []);
    });
};

module.exports = new Kickass();
