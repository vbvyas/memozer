/*
 * GET social network search page (start of adding contact process).
 */

var twit = require('../api/twit');

exports.search = function(req, res) {
	res.render('sn_search', {
		title : 'memozer | search network'
	});
};

exports.search_results = function(req, res) {
	if (req.query.twitter) {
		// Twitter handle specified, do lookup
		twit.search_handle(req.query.twitter.trim(), function(searchResponse) {
			results = parseTwitterUserSerchResults(searchResponse);
			res.render('sn_search_results', {
				title : 'memozer | results for "' + req.query.twitter + '"',
				results : results,
				query : req.query.twitter
			});
		});
	} else {
		// Person's name specified
		twit.search(req.query.name, function(searchResponse) {
			results = parseTwitterUserSerchResults(searchResponse);
			res.render('sn_search_results', {
				title : 'memozer | results for "' + req.query.name + '"',
				results : results,
				query : req.query.name
			});
		});
	}
};

function parseTwitterUserSerchResults(searchResponse) {
	// console.log(searchResponse.length);
	// console.log(searchResponse[0].name);
	// console.log(searchResponse[0].screen_name);
	// console.log(searchResponse[0].description);
	// console.log(searchResponse[0].profile_image_url);
	// console.log(searchResponse[0].location);
	// console.log(new Date().getTime());

	var results = [];
	for ( var i = 0; searchResponse && i < searchResponse.length; i++) {
		result = new Object();
		result.name = searchResponse[i].name;
		result.screen_name = searchResponse[i].screen_name;
		result.profile_image_url = searchResponse[i].profile_image_url;

		// TODO some hook in case already a contact
		
		results.push(result);
	}

	return results;
}