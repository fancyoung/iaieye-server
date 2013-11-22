var mongoose = require('mongoose'),
    User = mongoose.model('User');

/**
 * Create user
 */
exports.create = function(req, res, next) {
  var user = new User(req.body);
  user.provider = 'local';
  user.save(function(err) {
    if (err) {
    console.log(err)
      return res.json(400, err);
    }
    req.logIn(user, function(err) {
      if (err) return next(err);
      return res.json(200, { id: user._id, username: user.name, role: user.role });
    });
  });
};

exports.hello = function(req, res){
  res.send({ email: 'siyang' });
};
