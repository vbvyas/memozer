/**
 * Module dependencies.
 */

var express = require('express')
  , passport = require('passport')
  , fs = require('fs')
  , http = require('http')
  , path = require('path');

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

//bootstrap passport config
require('./config/passport')(passport, config)

// Bootstrap routes
var socialnetwork = require('./routes/socialnetwork')
  , contacts = require('./routes/contacts')
  , followups = require('./routes/followups')
  , users = require('./routes/users')
  , twit = require('./api/twit')
  , auth = require('./middlewares/authorization')
  , routes = require('./routes');

var  mongoStore = require('connect-mongo')(express)
  , flash = require('connect-flash')
  , helpers = require('view-helpers')
  , pkg = require('./package.json');

//var projectAuth = [auth.requiresLogin, auth.project.hasAuthorization]

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
// express/mongo session storage
app.use(express.session({
  secret: 'noobjs',
  store: new mongoStore({
    url: config.db,
    collection : 'sessions'
  })
}))

// use passport session
app.use(passport.initialize())
app.use(passport.session())

// connect flash for flash messages - should be declared after sessions
app.use(flash())

// should be declared after session and flash
app.use(helpers(pkg.name))

// adds CSRF support
if (process.env.NODE_ENV !== 'test') {
  app.use(express.csrf())
}

// This could be moved to view-helpers :-)
app.use(function(req, res, next){
  res.locals.csrf_token = req.csrfToken()
  next()
})

//// assume "not found" in the error msgs
//// is a 404. this is somewhat silly, but
//// valid, you can do whatever you like, set
//// properties, use instanceof etc.
//app.use(function(err, req, res, next){
//  // treat as 404
//  if (err.message
//    && (~err.message.indexOf('not found')
//    || (~err.message.indexOf('Cast to ObjectId failed')))) {
//    return next()
//  }
//
//  // log it
//  // send emails if you want
//  console.error(err.stack)
//
//  // error page
//  res.status(500).render('500', { error: err.stack })
//})
//
//// assume 404 since no middleware responded
//app.use(function(req, res, next){
//  res.status(404).render('404', {
//    url: req.originalUrl,
//    error: 'Not found'
//  })
//})

app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

// Home
app.get('/', routes.index);

// Social network routes
app.get('/sn/search', socialnetwork.search);
app.get('/sn/q', socialnetwork.search_results);

// Contacts routes
app.get('/contacts', contacts.list);
app.get('/contact', contacts.show);
app.get('/contact/edit', contacts.edit);

// Follow-ups routes
app.get('/followups', followups.list);
app.get('/followup', followups.show);

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

app.param('userId', users.user)

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});

// // EXAMPLE ON HOW TO USE THE TWITTER API TO RETURN USERS
// twit.search_handle('kevd1337', function(res) {
// console.log(res);
// });
