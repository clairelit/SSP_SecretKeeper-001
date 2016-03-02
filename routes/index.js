var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var mongoClient = require('mongodb').MongoClient;


// If I am running locally then use 'mongodb://localhost:27017/test' otherwise
// look for the environment variable
var url = process.env.CUSTOMCONNSTR_MongoDB || 'mongodb://localhost:27017/mySecretDatabase';


router.post('/register', function(req, res, next){
  var db = req.db;
  var userName = req.body.username;
  var userPassword = req.body.password;

  var collection=db.get('userTable');

  collection.insert({
    "username": userName,
    "password": userPassword
}, function(err, doc){
  if(err){
    res.send("There was a problem adding information to the Database");
  }
  else{
    //var sessionUserName=req.body.username;
    req.session.userName = userName;
    console.log(req.session.userName);
    res.redirect('/');
  }
});
});



router.get('/register', function(req, res, next){
  res.render('register');
});


router.get('/', function(req, res, next){

   if(req.session.userName === "undefined" || req.session.userName == null){
    res.render('login');
  }
  else{
    res.redirect("/mySecrets");
  }
});



//Creating a variable to hold a new secret and pushing it into the array.
router.post('/addNewSecret', function(req, res, next){
  var db = req.db;
  console.log(req.session.userName);
  var author = req.session.userName;
  var secretText = req.body.secretText;
  var collection = db.get('secretTable');

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
  var db=req.db;
  var collection=db.get('secretTable');
  collection.remove({_id: idForDelete},{},function(e, docs)
  {
  res.redirect('/mySecrets');
});

});

//This is where the requests are sent by the router.
//If the router just receives a get request with /login, use the function below
//This is the file that handles all of the requests.
/* GET home page. */
router.get('/login', function(req, res, next){
  res.render('login');
});


router.get('/mySecrets', function(req, res, next){
  var currentUser = req.session.userName;
  var db=req.db;
  var collection=db.get('secretTable');
  collection.find({author: currentUser},{},function(e, docs){
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
  var enteredUserName = req.body.userName;
  //console.log(enteredUserName);
  //console.log(req.body.userName);
  var enteredPassword = req.body.password;
  var db = req.db;
  var collection = db.get('userTable');
  collection.find({username: enteredUserName},{},function(e, docs){
    //if(!docs.username){
      //res.render('wrongLogin');
    //}
    for(var i in docs){
      if(docs[i].password == enteredPassword){
        var userName = req.body.userName;
        req.session.userName = userName;
        res.redirect('/mySecrets');
      }
      else{
        res.render('wrongLogin');
      }
    }
});
});

// Logout endpoint
router.get('/logout', function (req, res, next) {
  req.session.destroy();
  res.redirect('/');
});


module.exports = router;
