var mongoose = require('mongoose'), Followup = mongoose.model('Followup'), _ = require('underscore'), utils = require('../lib/utils'), moment = require('moment'), util = require('util');

exports.list = function(req, res) {
	var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
	var perPage = (req.param('perPage') > 0 ? req.param('perPage') : 25);
	var showComplete = (req.param('showComplete') != null ? req.param('showComplete') == 'true' : false);
	var criteria = null;
	if(showComplete){
		criteria = {
			username : req.user.username
		}
	} else {
		criteria = {
				username : req.user.username,
				isComplete : false
			}
	}
	var options = {
		perPage : perPage,
		page : page,
		criteria : criteria
	}

	Followup.list(options, function(err, followups) {
		if (err)
			return res.render('500');

		Followup.count(criteria).exec(function(err, count) {
			res.render('followup_list', {
				title : 'memozer | followups',
				followups : followups,
				perPage : perPage,
				page : page + 1,
				showComplete : showComplete,
				pageUrl: '/followups',
				pages : Math.ceil(count / perPage)
			});
		});
	});
};

exports.contactFollowups = function(req, res) {
	var contactTwitter = req.param('twitter');
	var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
	var perPage = (req.param('perPage') > 0 ? req.param('perPage') : 25);
	// By default show complete for contact followups
	var showComplete = (req.param('showComplete') != null ? req.param('showComplete') == 'true' : true);
	var criteria = null;
	if(showComplete){
		criteria = {
			username : req.user.username,
			contactUsername: contactTwitter
		}
	} else {
		criteria = {
				username : req.user.username,
				contactUsername: contactTwitter,
				isComplete : false
			}
	}
	var options = {
		perPage : perPage,
		page : page,
		criteria : criteria
	}

	Followup.list(options, function(err, followups) {
		if (err)
			return res.render('500');

		Followup.count(criteria).exec(function(err, count) {
			res.render('followup_list', {
				title : 'memozer | followups',
				followups : followups,
				perPage : perPage,
				page : page + 1,
				showComplete : showComplete,
				pages : Math.ceil(count / perPage),
				pageUrl: '/followups/contacts/' + contactTwitter,
				contactTwitter: contactTwitter
			});
		});
	});
};

exports.show = function(req, res) {
	var followup_id = req.param('id');

	Followup.load(followup_id, function(err, followup) {
		if (err)
			return res.render('500');

		var created_ago = null;
		if (followup.createdAt) {
			created_ago = moment(followup.createdAt).fromNow();
		}
		var due_from_now = null;
		if (followup.dueDate) {
			due_from_now = moment(followup.dueDate).fromNow();
		}

		res.render('followup', {
			title : 'memozer | followup',
			followup : followup,
			created_ago : created_ago,
			due_from_now : due_from_now
		});
	});
};

exports.new = function(req, res) {	
	// get pre-populated values
	params = new Object();
	if(req.query.contact_username){
		params.contactUsername= req.query.contact_username;
	}
	if(req.query.contact_name){
		params.contactName= req.query.contact_name;
	}		
	if(req.query.contact_profile_image_url){
		params.contactProfileImageUrl= req.query.contact_profile_image_url;
	}	
	
	var followup = new Followup(params);

	res.render('followup_new', {
		title : 'memozer | new followup', followup: followup 
	});
};

exports.create = function (req, res) {
	  var followup = new Followup(req.body);	  
	  followup.username = req.user.username;
	  followup.dueDate = new Date(followup.dueDateMMDDYYYY);
	  
	  console.log('saving followup: ' + followup);

	  followup.save(function (err) {
	    if (!err) {	      
	      return res.redirect('/followups/' + followup._id);
	    }

	    console.log(err);
	    res.render('followup_new', {
	      title: 'memozer | new followup',
	      followup: followup,
	      errors: utils.errors(err.errors || err)
	    });
  });
};

exports.update = function(req, res) {
	var followup_id = req.param('id');

	Followup.load(followup_id, function(err, followup) {
		if (err)
			return res.render('500');

		console.log('updating followup: ' + followup);
		console.log(req.body);
		followup = _.extend(followup, req.body);
		if(req.body.isComplete){
			followup.isComplete = true;
		} else {
			followup.isComplete = false;
		}
		followup.dueDate = new Date(followup.dueDateMMDDYYYY);

		followup.save(function (err) {
			  if (!err) {	      
				  return res.redirect('/followups/' + followup._id);
			  }		
			  console.log(err);
			  
			  res.render('followup_edit', {
		      title: 'memozer | edit followup',
		      followup: followup,
		      errors: utils.errors(err.errors || err)
		    });
		});
	});
};

exports.setComplete =  function(req, res) {
	var followup_id = req.param('id');

	Followup.load(followup_id, function(err, followup) {
		if (err)
			return res.render('500');

		console.log('setting followup to complete: ' + followup);
		followup.isComplete = true;
		followup.save();
		
		res.json(200, {success: 'true'});
	});
};

exports.setIncomplete =  function(req, res) {
	var followup_id = req.param('id');

	Followup.load(followup_id, function(err, followup) {
		if (err)
			return res.render('500');

		console.log('setting followup to incomplete: ' + followup);
		followup.isComplete = false;
		followup.save();
		
		res.json(200, {success: 'true'});
	});
};

exports.edit = function(req, res) {
	var followup_id = req.param('id');		
	
	Followup.load(followup_id, function(err, followup){
		if(err) return res.render('500');		
		
		res.render('followup_edit', {
			title : 'memozer | edit followup',
			followup: followup
		});
	});
};

exports.destroy = function(req, res){
	var followup_id = req.param('id');
	
	Followup.load(followup_id, function(err, followup){
		if(err) return res.render('500');		
		
		followup.remove(function(err){
	    	res.redirect('/followups');
	  });
	});		
};