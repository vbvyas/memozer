
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

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
  return tags.split(',')
}

/**
 * Contact Schema
 */

var ContactSchema = new Schema({
  name: {type : String, default : '', trim : true},
  twitterUsername: {type : String, default : '', trim : true},
  memo: {type : String, default : '', trim : true},
  user: {type : Schema.ObjectId, ref : 'User'},
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
ContactSchema.path('name').validate(function (title) {
  return title.length > 0
}, 'name cannot be blank')

ContactSchema.path('twitterUsername').validate(function (description) {
  return description.length > 0
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

  load: function (user, contactTwitterUsername, cb) {
    this.findOne({ 'user.username': user.username, twitterUsername : contactTwitterUsername })
      .populate('user', 'name username')
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

    this.find(criteria)
      .populate('user', 'name username')
      .sort('name')
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb)
  }
}

mongoose.model('Contact', ContactSchema)
