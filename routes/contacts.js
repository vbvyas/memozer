/*
 * GET list of contacts
 */

exports.list = function(req, res) {
	res.render('contacts_list', {
		title : 'memozer | contacts'
	});
};

exports.show = function(req, res) {
	res.render('contact', {
		title : 'memozer | contact'
	});
};
