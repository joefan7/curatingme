var express = require('express');
var app = express();
var HTTP = require('http');
var HTTPS = require('https'); 
var fs = require('fs');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var request = require('request');

app.use(express.static('./public'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// initialize Account Kit with CSRF protection
AccountKit_OnInteractive = function(){
    AccountKit.init(
      {
        appId:1526244437434268, 
        state:"249738572349872034", 
        version:"v1.1",
        fbAppEventsEnabled:true,
        Redirect:"./public/html/authenticated.html"
      }
    );
  };

  // login callback
  function loginCallback(response) {
    if (response.status === "PARTIALLY_AUTHENTICATED") {
      var code = response.code;
      var csrf = response.state;
      // Send code to server to exchange for access token
    }
    else if (response.status === "NOT_AUTHENTICATED") {
      // handle authentication failure
    }
    else if (response.status === "BAD_PARAMS") {
      // handle bad parameters
    }
  }

  // phone form submission handler
  function smsLogin() {
    var countryCode = document.getElementById("country_code").value;
    var phoneNumber = document.getElementById("phone_number").value;
    AccountKit.login(
      'PHONE', 
      {countryCode: countryCode, phoneNumber: phoneNumber}, // will use default values if not specified
      loginCallback
    );
  }


  // email form submission handler
  function emailLogin() {
    var emailAddress = document.getElementById("email").value;
    AccountKit.login(
      'EMAIL',
      {emailAddress: emailAddress},
      loginCallback
    );
  }
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=


// Client routes
// home page route
app.get('/', function(req,res){
    res.sendFile('./html/index.html', {root: './public'})
})

// ssl
try {
    var httpsConfig = {
        // --- Dev Box SSL
        key  : fs.readFileSync('/etc/letsencrypt/live/dev.curatingme.com/privkey.pem'), 
        cert : fs.readFileSync('/etc/letsencrypt/live/dev.curatingme.com/cert.pem')
        // --- Prod Box SSL
        // key  : fs.readFileSync('/etc/letsencrypt/live/curatingme.com/privkey.pem'),
        // cert : fs.readFileSync('/etc/letsencrypt/live/curatingme.com/cert.pem')
    }
    var httpsServer = HTTPS.createServer(httpsConfig, app)
    httpsServer.listen(443)
}
catch(error){
    console.log(error)
    console.log('could not set up HTTPS')
}
finally {
    console.log('this code runs regardless of whether the above code succeeded or failed')
}

var httpApp = express()
httpApp.use(function(req, res){
    console.log(req.url)
    // res.redirect('http://localhost:8000' + req.url) // local Port
    // res.redirect('https://curatingme.com' + req.url) // production
    res.redirect('https://dev.curatingme.com' + req.url) // dev
})
/////////////// SSL End ////////////

// Use the following for Prod and Dev
//listen on port 80
  httpApp.listen(80, function () {
    console.log('Express app listening on port 80');
  });

// app.listen(8000);
