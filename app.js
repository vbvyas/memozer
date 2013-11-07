/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , socialnetwork = require('./routes/socialnetwork')
  , contacts = require('./routes/contacts')
  , followups = require('./routes/followups')
  , twit = require('./api/twit')
  , http = require('http')
  , path = require('path');

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
  app.use(express.session());
app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/sn/search', socialnetwork.search);
app.get('/sn/q', socialnetwork.search_results);
//app.get('/sn/search_result', socialnetwork.search_result);
app.get('/contacts', contacts.list);
app.get('/contact', contacts.show);
app.get('/contact/edit', contacts.edit);
app.get('/followups', followups.list);
app.get('/followup', followups.show);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// EXAMPLE ON HOW TO USE THE TWITTER API TO RETURN USERS
twit.search_handle('kevd1337', function(res) {
  console.log(res);
});
