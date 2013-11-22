var mongoose = require('mongoose'),
  LocalStrategy = require('passport-local').Strategy,
  User = mongoose.model('User'),
  config = require('./config');

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function(id, done) {
    var user = User.findOne({
      _id: id
    }, function(err, user) {
      done(err, user); 
    });
  });
  passport.use(new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    }, 
    function(email, password, done) {
      User.findOne({
        email: email
      }, function(err, user){
        if(err) {
          return done(err);
        }
        if(!user) {
          return done(null, false, { message: '邮箱错误' });
        } else if(!user.authenticate(password)) {
          return done(null, false, { message: '密码错误' });
        }
        return done(null, user);
      });
    }
  ));
};
