
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

/**
 * Followup Schema
 */

var FollowupSchema = new Schema({
  // Follow-up owner details
  username: {type : String, default : '', trim : true},  

  // Follow-up contact details
  contactUsername: {type : String, default : '', trim : true},  
  contactName: {type : String, default : '', trim : true},
  contactProfileImageUrl: {type : String, default : '', trim : true},
  
  // Follow-up details
  description: {type : String, default : '', trim : true},
  isComplete: {type: Boolean, default: false},
  dueDateMMDDYYYY  : {type : String, default : '', trim : true},
  dueDate  : {type : Date, default : Date.now},
  createdAt  : {type : Date, default : Date.now}  
})

/**
 * Validations
 */
FollowupSchema.path('username').validate(function (username) {
  return username.length > 0
}, 'username cannot be blank')

FollowupSchema.path('username').validate(function (contactUsername) {
  return contactUsername.length > 0
}, 'contactUsername cannot be blank')

FollowupSchema.path('description').validate(function (description) {
  return description.length > 0
}, 'description cannot be blank')


/**
 * Statics
 */

FollowupSchema.statics = {

  load: function (id, cb) {
    this.findOne({ _id : id })
      .exec(cb)
  },

  list: function (options, cb) {
    var criteria = options.criteria || {}
    this.find(criteria)
      .sort('dueDate')
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb)
  }
}

mongoose.model('Followup', FollowupSchema)
