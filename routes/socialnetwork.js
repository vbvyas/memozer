/*
 * GET social network search page (start of adding contact process).
 */

var twit = require('../api/twit');
var querystring = require("querystring");
var mongoose = require('mongoose');
var Contact = mongoose.model('Contact');
var async = require('async');

exports.search = function(req, res) {
	res.render('sn_search', {
		title : 'memozer | search network'
	});
};

exports.search_results = function(req, res) {
	var searchResponse;
	var results;
	if (req.query.twitter) {
		// Twitter handle specified, do lookup
		async.series([
				function(callback) {
					twit.search_handle(req.query.twitter.trim(), function(
							response) {
						searchResponse = response;
						callback();
					});
				},
				function(callback) {
					parseTwitterUserSearchResults(searchResponse,
							req.user.username, function(parsedResults) {
								results = parsedResults;
								callback();
							});
				} ], function(err) {
			res.render('sn_search_results', {
				title : 'memozer | results for "' + req.query.twitter + '"',
				results : results,
				query : req.query.twitter
			});
		});
	} else {
		// Person's name specified, do twitter search
		async.series([
				function(callback) {
					twit.search(req.query.name, function(response) {
						searchResponse = response;
						callback();
					});
				},
				function(callback) {
					parseTwitterUserSearchResults(searchResponse,
							req.user.username, function(parsedResults) {
								results = parsedResults;
								callback();
							});
				} ], function(err) {
			res.render('sn_search_results', {
				title : 'memozer | results for "' + req.query.twitter + '"',
				results : results,
				query : req.query.name
			});
		});
	}
};

function parseTwitterUserSearchResults(searchResponse, username, cb) {
	if (!searchResponse || searchResponse.length == 0) {
		return [];
	}
	var results = [];
	async.each(searchResponse, function(searchResult, callback) {
		Contact.load(username, searchResult.screen_name,
				function(err, contacts) {
					result = new Object();
					result.name = searchResult.name;
					result.screen_name = searchResult.screen_name;
					result.profile_image_url = searchResult.profile_image_url;
					result.description = searchResult.description;
					if (err || !contacts || contacts.length <= 0) {
						// Not connected
						var quick_add_link = '/contacts/new?'
								+ querystring.stringify(result);
						result.quick_add_link = quick_add_link;
					} else {
						// Connected
						result.contact_link = '/contacts/'
								+ searchResult.screen_name;
					}
					results.push(result);

					callback();
				});
	}, function(err) {
		if (err)
			console.log(err);
		cb(results);
	});
}
