var mongoose = require('mongoose')
  , Contact = mongoose.model('Contact')
  , _ = require('underscore')
  , utils = require('../lib/utils')
  , moment = require('moment')
  , twit = require('../api/twit')
  , util = require('util');

exports.list = function(req, res) {
	  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
	  var perPage = 30;
	  var options = {
	    perPage: perPage,
	    page: page,
	    criteria: {username: req.user.username}
	  }
	  
	Contact.list(options, function(err, contacts){
		// console.log('LOAD RETURNED...');
		// console.log(contacts);
		if(err) return res.render('500');
		
		Contact.count().exec(function (err, count){								
			res.render('contacts_list', {
				title : 'memozer | contacts',
				contacts: contacts,
				page: page + 1,
				pages: Math.ceil(count / perPage)
				});	
			}
		);
	});
};

exports.show = function(req, res) {
	var contactTwitterUsername = req.param('twitter');		
// console.log("REQ: " + req.params);
// console.log(util.inspect(req.params, false, null));
	// console.log('t: ' + contactTwitterUsername);
	Contact.load(req.user.username, contactTwitterUsername, function(err, contacts){
		var contact = contacts[0];
		// console.log('LOAD RETURNED');
		// console.log(contact);
		if(err) return res.render('500');
		
		if (contact.createdAt){
			var ago = moment(contact.createdAt).fromNow();
		}

    var locationName = contact.connectionLocation.name;

    var isBlank = function(str) {
      return (!str || /^\s*$/.test(str));
    }

    var tweet = util.format("Hey @%s, it was great meeting you%s. Let's meet for coffee!", contact.twitterUsername, isBlank(locationName) ? '' : ' at ' + locationName);
		
		res.render('contact', {
			title : 'memozer | contact',
			contact: contact,
			ago: ago,
      tweet: tweet
		});
	});
};

exports.new = function(req, res) {
	// TODO check if contact with given handle already exists for given user
	
	// get pre-populated values
	params = new Object();
	if(req.query.name){
		params.name= req.query.name;
	}	
	if(req.query.screen_name){
		params.twitterUsername= req.query.screen_name;
	}
	if(req.query.description){
		params.memo= req.query.description;
	}
	if(req.query.profile_image_url){
		params.profileImageUrl= req.query.profile_image_url;
	}
	
	var contact = new Contact(params);

	res.render('contact_new', {
		title : 'memozer | new contact', contact: contact 
	});
};

exports.create = function (req, res) {
	  var contact = new Contact(req.body);	  
	  contact.username = req.user.username;
	  
	  console.log('saving contact: ' + contact);

	  contact.save(function (err) {
	    if (!err) {	      
        // TODO: Come up with a better tweet
        var tweet = util.format("@%s just connected with @%s through @memozerapp www.memozer.com", contact.username, contact.twitterUsername);
        twit.post_tweet(tweet, contact.connectionLocation);
	      return res.redirect('/contacts/' + contact.twitterUsername);
	    }

	    console.log(err);
	    res.render('contact_new', {
	      title: 'memozer | new contact',
	      contact: contact,
	      errors: utils.errors(err.errors || err)
	    });
    });
};

exports.update = function (req, res) {
	var contactTwitterUsername = req.params.twitter_sn;		
	
	Contact.load(req.user.username, contactTwitterUsername, function(err, contacts){
		if(err) return res.render('500');
	
		var contact = contacts[0];
		console.log('updating contact: ' + contact);
		contact = _.extend(contact, req.body);
		
		  contact.save(function (err) {
			  if (!err) {	      
				  return res.redirect('/contacts/' + contact.twitterUsername);
			  }		
			  console.log(err);
			  
			  res.render('contact_edit', {
		      title: 'memozer | edit contact',
		      contact: contact,
		      errors: utils.errors(err.errors || err)
		    });
		});
	});	
};

exports.edit = function(req, res) {
	var contactTwitterUsername = req.params.twitter_sn;		
	
	Contact.load(req.user.username, contactTwitterUsername, function(err, contacts){
		if(err) return res.render('500');		
		
		var contact = contacts[0];
		res.render('contact_edit', {
			title : 'memozer | edit contact',
			contact: contact
		});
	});
};

exports.destroy = function(req, res){
	var contactTwitterUsername = req.params.twitter_sn;		
	
	Contact.load(req.user.username, contactTwitterUsername, function(err, contacts){
		if(err) return res.render('500');		
		var contact = contacts[0];
	    contact.remove(function(err){
	    	res.redirect('/contacts');
	  });
	});		
};
