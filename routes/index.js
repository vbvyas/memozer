/*
 * GET home page.
 */

var mongoose = require('mongoose'), Contact = mongoose.model('Contact');

exports.index = function(req, res) {
	Contact.count({
		user : req.user
	}, function(err, contactCounts) {
		
		res.render('index', {
			title : 'memozer',
			user : req.user,
			contactCounts : contactCounts
		});
	});
};
