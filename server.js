var express = require('express'),
  mongoStore = require('connect-mongo')(express),
  fs = require('fs'),
  passport = require('passport');

require('coffee-script');

// Load configurations
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development',
  config = require('./config/config'),
  mongoose = require('mongoose');

// Bootstrap db connection
var db = mongoose.connect(config.db);

// Bootstrap models
var models_path = __dirname + '/models';
var walk = function(path) {
  fs.readdirSync(path).forEach(function(file) {
    if(/^[^.]/.test(file)){
      var newPath = path + '/' + file;
      var stat = fs.statSync(newPath);
      if (stat.isFile()) {
        if (/^[^.](.*)\.(js|coffee)/.test(file)) {
          require(newPath);
        }
      } else if (stat.isDirectory()) {
        walk(newPath);
      }
    }
  });
};
walk(models_path);

// bootstrap passport config
require('./config/passport')(passport);

// app
var app = express();

app.set('port', port);
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());

//express/mongo session storage
app.use(express.session({
  secret: 'mysecret',
  store: new mongoStore({
    url: config.db,
    collection: 'sessions'
  })
}));
// app.use(express.cookieSession(
//   {
//     secret: process.env.COOKIE_SECRET || "mysecret"
//   }));

//app.use(express.session({ cookie: { maxAge: 60000 }}));

app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

//Bootstrap routes
require('./config/routes')(app, passport);

var port = config.port;

app.listen(port)
console.log("Express server listening on port " + port);

exports = module.exports = app;
