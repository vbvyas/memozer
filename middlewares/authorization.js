/*
 *  Generic require login routing middleware
 */

exports.requiresLogin = function(req, res, next) {
	if (!req.isAuthenticated()) {
		req.session.returnTo = req.originalUrl
		return res.redirect('/login')
	}
	next()
}

exports.contact = {
	hasAuthorization : function(req, res, next) {
		if (req.contact.user.id != req.user.id) {
			req.flash('info', 'You are not authorized')
			return res.redirect('/contacts/' + req.contact.id)
		}
		next()
	}
}
