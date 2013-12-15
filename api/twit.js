var env = process.env.NODE_ENV || "development", Twit = require('twit'), config = require('../config/config')[env];

var t = new Twit({
	consumer_key : config.twitter.clientID,
	consumer_secret : config.twitter.clientSecret,
	access_token : config.twitter.accessToken,
	access_token_secret : config.twitter.accessTokenSecret
})

exports.search = function(query, callback) {
	t.get('users/search', {
		q : query,
		page : 1,
		count : 20
	}, function(err, reply) {
		if (err) {
			console.log(err);
			callback([]);
		}
		callback(reply);
	});
}

exports.search_handle = function(query, callback) {
	t.get('users/lookup', {
		screen_name : query
	}, function(err, reply) {
		if (err) {
			console.log(err);
			callback([]);
		}
		callback(reply);
	});
}
