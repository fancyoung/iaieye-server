var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto'),
    _ = require('underscore');

var validators = require('validator').validators; // better idea?

var UserSchema = new Schema({
    email: {
      type: String,
      lowercase: true,
      index: true,
      unique: true,
      required: true
    },
    username: {
      type: String,
      index: true,
      unique: true,
      required: true
    },
    role: String,
    provider: String,
    hashed_password: {
      type: String,
      required: true
    },
    salt: String
});

/**
 * Virtuals
 */
UserSchema.virtual('password').set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
}).get(function() {
    return this._password;
});

/**
 * Validations
 */
UserSchema.path('email').validate(function(email) {
  return email && validators.isEmail(email);
}, 'Invalid email');

UserSchema.path('username').validate(function(username) {
  return username && validators.len(username, 2, 18);
}, 'Invalid username');

UserSchema.path('hashed_password').validate(function(hashed_password) {
  return hashed_password && hashed_password.length;
}, 'Invalid password');

/**
 * Pre-save hook
 */
UserSchema.pre('save', function(next) {
  this.model('User').findOne({email: this.email}).exec(function(err, user) {
    if(user){
      next(new Error('email exist'));
    } else {
      next();
    }
  });
  // this.model('User').findOne({username: this.username}).exec(function(err, user) {
  //   if(user){
  //     next(new Error('username exist'));
  //   } else {
  //     next();
  //   }
  // });
});

/**
 * Methods
 */
UserSchema.methods = {
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },
    makeSalt: function() {
        return Math.round((new Date().valueOf() * Math.random())) + '';
    },
    encryptPassword: function(password) {
        if (!password) return '';
        return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
    }
};

mongoose.model('User', UserSchema);

