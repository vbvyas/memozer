/*
 * GET list of contacts
 */

var mongoose = require('mongoose')
  , Contact = mongoose.model('Contact')
  , _ = require('underscore')
  , utils = require('../lib/utils')
  , moment = require('moment');

exports.list = function(req, res) {
	  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
	  var perPage = 30;
	  var options = {
	    perPage: perPage,
	    page: page,
	    'user.username': req.user.username
	  }
	  
	Contact.list(options, function(err, contacts){
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
}

exports.show = function(req, res) {
	var contactTwitterUsername = req.params.twitter_sn;		
	
	Contact.load(req.user, contactTwitterUsername, function(err, contact){
		if(err) return res.render('500');
		
		if (contact.createdAt){
			var ago = moment(contact.createdAt).fromNow();
		}
		
		res.render('contact', {
			title : 'memozer | contact',
			contact: contact,
			ago: ago
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
	  contact.user = req.user;
	  
	  console.log('saving contact: ' + contact);

	  contact.save(function (err) {
	    if (!err) {	      
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
	
	Contact.load(req.user, contactTwitterUsername, function(err, contact){
		if(err) return res.render('500');
	
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
	
	Contact.load(req.user, contactTwitterUsername, function(err, contact){
		if(err) return res.render('500');		
		
		res.render('contact_edit', {
			title : 'memozer | edit contact',
			contact: contact
		});
	});
};

exports.destroy = function(req, res){
	var contactTwitterUsername = req.params.twitter_sn;		
	
	Contact.load(req.user, contactTwitterUsername, function(err, contact){
		if(err) return res.render('500');		
		
	    contact.remove(function(err){
	    	res.redirect('/contacts');
	  });
	});		
};