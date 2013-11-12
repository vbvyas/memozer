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
		if (req.contact.username != req.user.username) {
			req.flash('info', 'You are not authorized')
			return res.redirect('/contacts/' + req.contact.twitterUsername)
		}
		next()
	}
}

exports.followup = {
	hasAuthorization : function(req, res, next) {
		if (req.followup.username != req.user.username) {
			req.flash('info', 'You are not authorized')
			return res.redirect('/followups/' + req.followup.id)
		}
		next()
	}
}