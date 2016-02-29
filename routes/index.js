var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');


var allSecrets = new Array();
var secretCounter = Number();

var getSecretIndex = function(secretID){
var secretIndex = -1;

  for (var i= 0; i < allSecrets.length; i++){
    console.log("Checking " + allSecrets[i].id + "against" + secretID);
    if (allSecrets[i].id == secretId){
      secretIndex = i;
    }
  }

  return secretIndex;
}

router.get('/', function(req, res, next){

   if(req.session.userName === "undefined" || req.session.userName == null){
    res.render('login');
  }
  else{
    res.redirect("/mySecrets");
  }
});



//Creating a variable to hold a new secret and pushing it into the array.
router.get('/addNewSecret', function(req, res, next){

  //if(req.session.allSecrets === "undefined" || req.session.allSecrets == null){
  //Here I am getting the the array and counter number from local storage so that I can add to them instead of overwriting them.
  //If I was to create a new array instead, like before, I would be creating a new empty array each time I restart the server and add a secret.
  var secretCounterFromStorage = localStorage.getItem('counterValue');
  var objectFromStorage = localStorage.getItem('allMySecrets');
  var arrayFromObject = JSON.parse(objectFromStorage);
  //creating an object to store the secret
  var secret = {};
  secret.id = secretCounterFromStorage++;
  secret.secret = req.query.secretText;
  allSecrets.push(secret);

  arrayFromObject.push(secret);
//Below I am setting the new versions of the counter and array into local storage after I add each secret.
  localStorage.setItem('allMySecrets', JSON.stringify(arrayFromObject));
  localStorage.setItem('counterValue', secretCounterFromStorage);
  console.log(secretCounter);

  console.log(localStorage.getItem('allMySecrets'));

  res.redirect('/mySecrets');
//}
});

router.get('/delete', function (req, res, next){
  console.log("Deleting secret" + req.query.id);
  var idForDelete = (req.query.id);
  console.log(idForDelete);
  var objectFromStorage = localStorage.getItem('allMySecrets');
  var arrayFromObject = JSON.parse(objectFromStorage);

  for (var i= 0; i < arrayFromObject.length; i++){
    if (arrayFromObject[i].id == idForDelete){
      arrayFromObject.splice(i, 1);
    }
  }

  console.log(arrayFromObject);
  localStorage.setItem('allMySecrets', JSON.stringify(arrayFromObject));
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
  console.log(req.session.userName);
  var retrieveCounterNumber = localStorage.getItem('counterValue');
  var retrivingData = localStorage.getItem('allMySecrets');
  var retrivedData = JSON.parse(retrivingData);
  //console.log(retrivedData[0].id);
  secretCounter = retrieveCounterNumber;
  console.log(retrivedData);
  res.render('mySecrets', {secrets: retrivedData});
});

//Dealing with a parameter from the form on the login page
//Adding a route/function to handle a post request
router.post('/login', function(req, res, next){
  var setUserName = 'clairelit';
  var setPassword = 'litclonmel';
  //res.redirect('/mySecrets');
  //res.render('mySecrets.jade');
  if(req.body.userName == setUserName && req.body.password == setPassword){

    res.redirect('/mySecrets');
    res.render('mySecrets.jade');
  //I've created a variable, which stores the parameter userName, sent from the form,
  //to the query and I'm grabbing it out of the query.
  //userName is a parameter sent from the form with the request to the funciton (on the login.jade page)
  var userNameForSession = req.body.userName;

  //This will store the users name in a session.
  //userName is a property of the session
  //Not sure if this will save when app is closed, will test
  req.session.userNameSession = userNameForSession;

//user will be brought to their secrets page when they click submit
//Or if their log in details are incorrect, they'll be brought to the wrongLogin page
//I'm going to use an array to store the users secrets
  res.render('mySecrets', {secrets: allSecrets});
  }
  else{
    res.render('wrongLogin');
  }
});


// Logout endpoint
router.get('/logout', function (req, res, next) {
  req.session.destroy();
  res.redirect('/');
});


//Ok, this is the code I got from stackoverflow which hopefully will help with azure.
function sessionCleanup() {
    sessionStore.all(function(err, sessions) {
        for (var i = 0; i < sessions.length; i++) {
            sessionStore.get(sessions[i], function() {} );
        }
    });
}

module.exports = router;
