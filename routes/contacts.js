/*
 * GET list of contacts
 */

var mongoose = require('mongoose')
  , Contact = mongoose.model('Contact')
  , _ = require('underscore')
  , utils = require('../lib/utils');

exports.list = function(req, res) {
	  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
	  var perPage = 30;
	  var options = {
	    perPage: perPage,
	    page: page,
	    user: req.user
	  }
	  
	Contact.list(options, function(err, contacts){
		if(err) return res.render('500');
		console.log(contacts)
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
	res.render('contact', {
		title : 'memozer | contact'
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
	      req.flash('success', 'Successfully add contact!');
	      return res.redirect('/contacts/'+contact.twitterUsername);
	    }

	    console.log(err);
	    res.render('contact_new', {
	      title: 'memozer | new contact',
	      contact: contact,
	      errors: utils.errors(err.errors || err)
    });
  });
};

exports.edit = function(req, res) {
	res.render('contact_edit', {
		title : 'memozer | contact edit'
	});
};