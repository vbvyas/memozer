/*
 * GET home page.
 */

var mongoose = require('mongoose'), Contact = mongoose.model('Contact'), Followup = mongoose
		.model('Followup');

exports.index = function(req, res) {
	var username = req.user ? req.user.username : null;
	Followup.count({
		username : username,
		isComplete: false
	}, function(err, followupCounts) {
		Contact.count({
			username : username
		}, function(err2, contactCounts) {
			res.render('index', {
				title : 'memozer | meet · connect · meet again!',
				username : username,
				contactCounts : contactCounts,
				followupCounts : followupCounts
			});
		});
	});
};
