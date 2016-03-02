var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

//var mongoClient = require('mongodb').MongoClient;


// If I am running locally then use 'mongodb://localhost:27017/test' otherwise
// look for the environment variable
//var url = process.env.CUSTOMCONNSTR_MongoDB || 'mongodb://localhost:27017/mySecretDatabase';


/*var getSecretIndex = function(secretID){
var secretIndex = -1;

  for (var i= 0; i < allSecrets.length; i++){
    console.log("Checking " + allSecrets[i].id + "against" + secretID);
    if (allSecrets[i].id == secretId){
      secretIndex = i;
    }
  }

  return secretIndex;
}*/



router.post('/register', function(req, res, next){
  var db=req.db;
  var userName=req.body.username;
  var userPassword=req.body.password;

  var collection=db.get('userTable');

  collection.insert({
    "username": userName,
    "password": userPassword
}, function(err, doc){
  if(err){
    res.send("There was a problem adding information to the Database");
  }
  else{
    var sessionUserName=req.body.username;
    req.session.userName = sessionUserName;
    res.redirect('/');
  }
});
});



router.get('/register', function(req, res, next){
  res.render('register');
});


router.get('/', function(req, res, next){

   if(req.session.username === "undefined" || req.session.username == null){
    res.render('login');
  }
  else{
    res.redirect("/mySecrets");
  }
});



//Creating a variable to hold a new secret and pushing it into the array.
router.post('/addNewSecret', function(req, res, next){
  var db=req.db;
  var author=req.session.userName;
  var secretText=req.body.secretText;
  var collection=db.get('secretTable');

  collection.insert({
    "author": author,
    "secretText": secretText
  }, function(err, doc){
  if(err){
    res.send("There was a problem adding the secret to the Database");
  }
  else{
    res.redirect('/');
  }
  });
});



router.get('/delete', function (req, res, next){
  console.log("Deleting secret" + req.query.id);
  var idForDelete = (req.query.id);
  console.log(idForDelete);
  res.redirect('/mySecrets');
});

//This is where the requests are sent by the router.
//If the router just receives a get request with /login, use the function below
//This is the file that handles all of the requests.
/* GET home page. */
router.get('/login', function(req, res, next){
  res.render('login');
});

router.get('/mySecrets', function(req, res, next){
  var currentUser=req.session.username;
  var db=req.db;
  var collection=db.get('secretTable');
  collection.find({"author": currentUser},{},function(e, docs){
  res.render('mySecrets', {secrets: docs});
});
});




router.get('/userList', function(req, res, next){
  var db=req.db;
  var collection=db.get('userTable');
  collection.find({},{},function(e, docs){
    res.render('userList', {"userList": docs});
  });
});



//Dealing with a parameter from the form on the login page
//Adding a route/function to handle a post request
router.post('/login', function(req, res, next){
// var setUserName = 'clairelit';
  //var setPassword = 'litclonmel';
  //if(req.body.userName == setUserName && req.body.password == setPassword){
  res.redirect('/mySecrets');
  var userNameForSession = req.body.userName;
  req.session.userNameSession = userNameForSession;
  //res.render('mySecrets', {secrets: allSecrets});
  //}
  //else{
    //res.render('wrongLogin');
  //}
});


// Logout endpoint
router.get('/logout', function (req, res, next) {
  req.session.destroy();
  res.redirect('/');
});


module.exports = router;
