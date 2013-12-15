/**
 * Module dependencies.
 */

var express = require('express'), passport = require('passport'), fs = require('fs'), http = require('http'), path = require('path');

// Load configurations
// if test env, load example file
var env = process.env.NODE_ENV || 'development', config = require('./config/config')[env], mongoose = require('mongoose');

// Bootstrap db connection
mongoose.connect(config.db)

// Bootstrap models
var models_path = __dirname + '/models'
fs.readdirSync(models_path).forEach(function(file) {
	if (~file.indexOf('.js'))
		require(models_path + '/' + file)
})

// bootstrap passport config
require('./config/passport')(passport, config)

// Bootstrap routes
var socialnetwork = require('./routes/socialnetwork'), contacts = require('./routes/contacts'), followups = require('./routes/followups'), users = require('./routes/users'), twit = require('./api/twit'), auth = require('./middlewares/authorization'), routes = require('./routes');

var MongoStore = require('connect-mongo')(express), flash = require('connect-flash'), helpers = require('view-helpers'), pkg = require('./package.json');

var app = express();

// all environments
app.locals.moment = require('moment');
app.set('port', process.env.PORT || 5000);
// NOT sure what this compress does, but it causes issues with twit.js when an
// error is
// thrown, and bombs the application
// app.use(express.compress({
// filter: function (req, res) {
// return /json|text|javascript|css/.test(res.getHeader('Content-Type'))
// },
// level: 9
// }))
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());


// expresso session storage
app.use(express.session({
	secret : 'mysuprefuckingsecretestring',
	  cookie : {
		    maxAge : 604800 // one week
		  },
    store: new MongoStore({url: config.db, collection : 'sessions'})
}));

// use passport session
app.use(passport.initialize())
app.use(passport.session())

// connect flash for flash messages - should be declared after sessions
app.use(flash())

// should be declared after session and flash
app.use(helpers(pkg.name))

// adds CSRF support
app.use(express.csrf())


app.use(function(req, res, next) {
	res.locals.csrf_token = req.csrfToken()
	next()
})

app.use(app.router);
// app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

// Pretty print html
app.configure('development', function () {
    app.locals.pretty = true
})
  app.configure('production', function () {
    app.locals.pretty = true
})  

// Home
app.get('/', routes.index);

// Social network routes
app.get('/sn/search', auth.requiresLogin, socialnetwork.search);
app.get('/sn/q', auth.requiresLogin, socialnetwork.search_results);

// Contacts routes
app.get('/contacts', auth.requiresLogin, contacts.list);
app.get('/contacts/new', auth.requiresLogin, contacts.new);
app.post('/contacts', auth.requiresLogin, contacts.create);
app.get('/contacts/:twitter', auth.requiresLogin, contacts.show);
app.get('/contacts/:twitter_sn/edit', auth.requiresLogin, contacts.edit);
app.put('/contacts/:twitter_sn', auth.requiresLogin, contacts.update);
app.del('/contacts/:twitter_sn', auth.requiresLogin, contacts.destroy);

// Follow-ups routes
app.get('/followups', auth.requiresLogin, followups.list);
app.get('/followups/contacts/:twitter', auth.requiresLogin, followups.contactFollowups);
app.get('/followups/new', auth.requiresLogin, followups.new);
app.get('/followups/complete/:id', auth.requiresLogin, followups.setComplete);
app.get('/followups/incomplete/:id', auth.requiresLogin, followups.setIncomplete);
app.post('/followups', auth.requiresLogin, followups.create);
app.get('/followups/:id', auth.requiresLogin, followups.show);
app.get('/followups/:id/edit', auth.requiresLogin, followups.edit);
app.put('/followups/:id', auth.requiresLogin, followups.update);
app.del('/followups/:id', auth.requiresLogin, followups.destroy);
// TODO: follow ups for contact

// user routes
app.get('/login', users.login)
app.get('/signup', users.signup)
app.get('/logout', users.logout)
app.post('/users', users.create)
app.post('/users/session', passport.authenticate('local', {
	failureRedirect : '/login',
	failureFlash : 'Invalid email or password.'
}), users.session)
app.get('/users/:userId', users.show)
app.get('/auth/twitter', passport.authenticate('twitter', {
	failureRedirect : '/login'
}), users.signin)
app.get('/auth/twitter/callback', passport.authenticate('twitter', {
	failureRedirect : '/login'
}), users.authCallback)

app.use(function(req, res, next) {
	res.status(404).render('404', {
		url : req.originalUrl
	})
})

app.param('userId', users.user)

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
