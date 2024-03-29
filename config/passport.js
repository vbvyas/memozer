var mongoose = require('mongoose')
// , LocalStrategy = require('passport-local').Strategy
, TwitterStrategy = require('passport-twitter').Strategy, User = mongoose
		.model('User')

module.exports = function(passport, config) {
	// serialize sessions
	passport.serializeUser(function(user, done) {
		done(null, user.id);
		// done(null, user);
	})

	passport.deserializeUser(function(id, done) {
		User.findOne({
			_id : id
		}, function(err, user) {
			done(err, user)
		})
		// done(null, obj);
	})

	// use local strategy
	// passport.use(new LocalStrategy({
	// usernameField: 'email',
	// passwordField: 'password'
	// },
	// function(email, password, done) {
	// User.findOne({ email: email }, function (err, user) {
	// if (err) { return done(err) }
	// if (!user) {
	// return done(null, false, { message: 'Unknown user' })
	// }
	// if (!user.authenticate(password)) {
	// return done(null, false, { message: 'Invalid password' })
	// }
	// return done(null, user)
	// })
	// }
	// ))

	// use twitter strategy
	passport.use(new TwitterStrategy({
		consumerKey : config.twitter.clientID,
		consumerSecret : config.twitter.clientSecret,
		callbackURL : config.twitter.callbackURL
	}, function(token, tokenSecret, profile, done) {
		User.findOne({
			'twitter.id' : profile.id
		}, function(err, user) {
			if (err) {
				return done(err)
			}
			if (!user) {
				user = new User({
					name : profile.displayName,
					username : profile.username,
					provider : 'twitter',
					twitter : profile._json
				})
				user.save(function(err) {
					if (err)
						console.log(err)
					return done(err, user)
				})
			} else {
				return done(err, user)
			}
		})
	}));
}
