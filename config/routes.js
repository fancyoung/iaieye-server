var async = require('async');

module.exports = function(app, passport) {
  var users = require('../controllers/users');
  var resources = require('../controllers/resources');
  
  // User Routes
  app.post('/users/check', users.check);

  // Resource Routes
  app.get('/resources', resources.list);
  app.post('/resources', resources.create);
  app.get('/resources', resources.show);
  app.put('/resources/:resourceId', resources.update);
  app.del('/resources/:resourceId', resources.destory);
  
  // auth
  app.post('/signup', users.create);

  app.post('/signin', function(req, res, next) {
    passport.authenticate('local', function(err, user) {
      if(err) {
        return next(err);
      }
      if(!user) {
        return res.send(401);
      }
      req.logIn(user, function(err){
        if(err) {
          return next(err);
        }
        if(req.body.rememberme) {
          req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 30; 
        }
        res.json(200, { id: user._id, username: user.username, role: user.role });
      });
    })(req, res, next);
  });

  app.post('/signout', function(req, res) {
    req.logOut();
    res.send(200);
  });
};
