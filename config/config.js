module.exports = {
	development : {
		db : 'mongodb://localhost/memozer_dev',
		twitter : {
			clientID : process.env.TWITTER_CONSUMER_KEY,
			clientSecret : process.env.TWITTER_CONSUMER_SECRET,
			accessToken : process.env.TWITTER_ACCESS_TOKEN,
			accessTokenSecret : process.env.TWITTER_ACCESS_TOKEN_SECRET,
			callbackURL : "http://127.0.0.1:" + process.env.PORT
					+ "/auth/twitter/callback"
		},
	},
	production : {
		db : process.env.MONGOLAB_URI || process.env.MONGOHQ_URL
				|| 'mongodb://localhost/memozer',
		twitter : {
			clientID : process.env.TWITTER_CONSUMER_KEY,
			clientSecret : process.env.TWITTER_CONSUMER_SECRET,
			accessToken : process.env.TWITTER_ACCESS_TOKEN,
			accessTokenSecret : process.env.TWITTER_ACCESS_TOKEN_SECRET,
			callbackURL : "http://www.memozer.com/auth/twitter/callback"
		},
	},
}
