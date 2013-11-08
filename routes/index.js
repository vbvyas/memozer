/*
 * GET home page.
 */

var mongoose = require('mongoose'), Contact = mongoose.model('Contact');

exports.index = function(req, res) {
	var username = req.user ? req.user.username : null;
	Contact.count({
		username : username
	}, function(err, contactCounts) {
		
		res.render('index', {
			title : 'memozer | home',
			username : username,
			contactCounts : contactCounts
		});
	});
};
