var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');


//Found this server on http://expressjs-book.com/index.html%3Fp=128.html
//var RedisStore = require('connect-redis')(express);

var allSecrets = new Array();
//var secretCounter = 1;
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
    //console.log(req.session.userName);
    var retrieveCounterNumber = localStorage.getItem('counterValue');
    var retrivingData = localStorage.getItem('allMySecrets');
    var retrivedData = JSON.parse(retrivingData);
    //console.log(retrivedData[0].id);
    secretCounter = retrieveCounterNumber;
    console.log(retrivedData);
    res.render('mySecrets', {secrets: retrivedData});
  }
});



//Creating a variable to hold a new secret and pushing it into the array.
router.get('/addNewSecret', function(req, res, next){
  //Here I am getting the the array and counter number from local storage so that I can add to them instead of overwriting them.
  //If I was to create a new array instead, like before, I would be creating a new empty array each time I restart the server and add a secret.
  var secretCounterFromStorage = localStorage.getItem('counterValue');
  var objectFromStorage = localStorage.getItem('allMySecrets');
  var arrayFromObject = JSON.parse(objectFromStorage);
  //creating an object to store the secret
  var secret = {};
  secret.id = secretCounterFromStorage++;
  secret.secret = req.query.secretText;
  //allSecrets.push(secret);
  arrayFromObject.push(secret);
//Below I am setting the new versions of the counter and array into local storage after I add each secret.
  localStorage.setItem('allMySecrets', JSON.stringify(arrayFromObject));
  localStorage.setItem('counterValue', secretCounterFromStorage);
  console.log(secretCounter);

  //console.log(localStorage.getItem('allMySecrets'));

  res.redirect('/');

});

router.get('/delete', function (req, res, next){
  console.log("Deleting secret" + req.query.id);
  var idForDelete = (req.query.id);
  console.log(idForDelete);
  var objectFromStorage = localStorage.getItem('allMySecrets');
  var arrayFromObject = JSON.parse(objectFromStorage);

  for (var i= 0; i < arrayFromObject.length; i++){
    if (arrayFromObject[i].id == idForDelete){
      arrayFromObject.shift(i, 1);
    }
  }

  console.log(arrayFromObject);
  localStorage.setItem('allMySecrets', JSON.stringify(arrayFromObject));
  res.redirect('/');
});

//This is where the requests are sent by the router.
//If the router just receives a get request with /login, use the function below
//This is the file that handles all of the requests.
/* GET home page. */
router.get('/login', function(req, res, next){
  res.render('login');
});

/*router.get('/hello', function(req, res, next) {
  res.render('hello', { title: 'Hello World' });
});*/

//Dealing with a parameter from the form on the login page
//Adding a route/function to handle a post request
router.post('/login', function(req, res, next){
  var setUserName = 'clairelit';
  var setPassword = 'litclonmel';

  if(req.body.userName == setUserName && req.body.password == setPassword){


  //I've created a variable, which stores the parameter userName, sent from the form,
  //to the query and I'm grabbing it out of the query.
  //userName is a parameter sent from the form with the request to the funciton (on the login.jade page)
  var userNameForSession = req.body.userName;

  //This will store the users name in a session.
  //userName is a property of the session
  //Not sure if this will save when app is closed, will test
  req.session.userNameSession = userNameForSession;

//Telling the server which jade page to render to html (in this one its the mySecrets page),
//and send to the browser after the user clicks submit


//user will be brought to their secrets page when they click submit
//Or if their log in details are incorrect, they'll be brought to the wrongLogin page
//I'm going to use an array to store the users secrets
  res.render('mySecrets', {secrets: allSecrets});
  }
  else{
    res.render('wrongLogin');
  }
});

router.get('/logout', function(req, res, next){
  req.session.destroy();
  res.redirect('/');
});


module.exports = router;
