var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//This is telling the app that routes is = the index.js file, which is in the routes folder
var routes = require('./routes/index');


//Tells our app that we want to talk to MongoDB.
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('mongodb://dbuserclaire:litclonmel@ds064278.mlab.com:64278/MongoLab-f');

// If I am running locally then use 'mongodb://localhost:27017/test' otherwise
// look for the environment variable
var url = process.env.CUSTOMCONNSTR_MongoDB || 'mongodb://dbuserclaire:litclonmel@ds064278.mlab.com:64278/MongoLab-f';

/*
 * Requiring the following package to be able to use sessions.
 * Need sessions to be able to store user details
 */
var session = require('express-session');

//Setting up the express app.  This must be put in before all middleware
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/public/css", express.static(path.join(__dirname, '/public/css')));
app.use("/public/fonts", express.static(path.join(__dirname, '/public/fonts')));
app.use("/public/images", express.static(path.join(__dirname, '/public/images')));
app.use("/public/javascripts", express.static(path.join(__dirname, '/public/javascripts')));
app.use("/public/js", express.static(path.join(__dirname, '/public/js')));
app.use("/public/img", express.static(path.join(__dirname, '/public/img')));


//Including this to get sessions to work
var expressSessionOptions = {
  secret:'mySecret',
  resave: true,
  saveUninitialized: true
}

//session middleware - has to be used
app.use(session(expressSessionOptions));

//This makes the database accessible to the router
app.use(function(req, res, next){
  req.db=db;
  next();
});

//Anytime i get any kind of a request, use routes, which is the index.js file
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
