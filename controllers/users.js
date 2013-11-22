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

/**
 * Chect email exists
 */
exports.check = function(req, res) {
  console.log(req.body.email);
  var user = User.findOne({email: req.body.email})
    .exec(function(err, user) {
      return res.json({user: !!user});
    });
}
