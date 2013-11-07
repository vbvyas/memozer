/*
 * GET list of contacts
 */

exports.list = function(req, res) {
	res.render('followup_list', {
		title : 'memozer | followups'
	});
};

exports.show = function(req, res) {
	res.render('followup', {
		title : 'memozer | followup'
	});
};