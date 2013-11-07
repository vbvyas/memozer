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

exports.user = {
	hasAuthorization : function(req, res, next) {
		if (req.profile.id != req.user.id) {
			req.flash('info', 'You are not authorized')
			return res.redirect('/users/' + req.profile.id)
		}
		next()
	}
}

//
// exports.project = {
// hasAuthorization : function(req, res, next) {
// if (req.project.user.id != req.user.id) {
// req.flash('info', 'You are not authorized')
// return res.redirect('/projects/' + req.project.id)
// }
// next()
// }
// }
