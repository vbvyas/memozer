
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema,
  _ = require('underscore');

/**
 * Getters
 */

var getTags = function (tags) {
  return tags.join(',')
}

/**
 * Setters
 */

var setTags = function (tags) {
  return _.uniq(tags.toLowerCase().split(','))
}

/**
 * Contact Schema
 */

var ContactSchema = new Schema({
  name: {type : String, default : '', trim : true},
  username: {type : String, default : '', trim : true}, // of contacts owner
  twitterUsername: {type : String, default : '', trim : true}, // of contact
  email: {type: String, default: '', trim: true},
  memo: {type : String, default : '', trim : true},
// user: {type : Schema.ObjectId, ref : 'User'},
  profileImageUrl: {type : String, default : '', trim : true},
  connectionLocation:{ // location that user met connection
	  name: {type : String, default : '', trim : true},
	  lat: {type : Number},
	  lng: {type : Number},
  },
  tags: {type: [], get: getTags, set: setTags},
  createdAt  : {type : Date, default : Date.now}
})

/**
 * Validations
 */
ContactSchema.path('name').validate(function (name) {
  return name.length > 0
}, 'name cannot be blank')

ContactSchema.path('username').validate(function (username) {
  return username.length > 0
}, 'name cannot be blank')

ContactSchema.path('twitterUsername').validate(function (twitterUsername) {
  return twitterUsername.length > 0
}, 'twitterUsername cannot be blank')


/**
 * Statics
 */

ContactSchema.statics = {
  /**
	 * Find Contact by id
	 * 
	 * @api private
	 */

// load: function (username, contactTwitterUsername, cb) {
// console.log('LOAD CALLED WITH ' + username);
// this.findOne({ username: username, twitterUsername : contactTwitterUsername
// })
// // .populate('user', 'name username')
// .exec(cb)
// },
	  load: function (username, contactTwitterUsername, cb) {
		  console.log('LOAD CALLED WITH ' + username + '|' + contactTwitterUsername);
// console.log({ username: username, twitterUsername: contactTwitterUsername});
	      this.find({ username: username, twitterUsername: contactTwitterUsername})
	     .limit(1)
	     .exec(cb)  
	  },	

  /**
	 * List contacts
	 * 
	 * @param {Object}
	 *            options
	 * @param {Function}
	 *            cb
	 * @api private
	 */

  list: function (options, cb) {
    var criteria = options.criteria || {}
// console.log('LIST CRITERIA- ' + criteria.twitterUsername);
    this.find(criteria)
// .populate('user', 'name username')
      .sort('name')
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb)
  }
}

mongoose.model('Contact', ContactSchema)
