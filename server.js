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

// API Routes

// Read userInformation Doc
app.get('/userInformation', function(req, res){
    db.UserInformationModel.findOne({"userId": req.query.userId},function(err,data){
        if(err){
            next(err)}
        else{
            res.send(data)
        }
    })
})

// Create userInformation Doc
app.post('/user_information/create', function(req, res, next){
    console.log("FROM SERVER", req.body);
    var newUserInformation = new db.UserInformationModel({
        userId: req.body.userId,
        uiName: req.body.uiName,
        uiEmail: req.body.uiEmail,
        uiBio: req.body.uiBio
    })
    newUserInformation.save(function(err,newUser){
        if (err) { next(err) }
        else {
            res.send(newUser)
        }
    })
})

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
