var express = require('express');
var app = express();
var HTTP = require('http');
var HTTPS = require('https'); 
var fs = require('fs');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var request = require('request');

var db = require('./db');
app.use(express.static('./public'));

app.use(express.static('./public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// API Routes
//=-=-=-= User Information =-=-=-=
// Read userInformation Doc
app.get('/userInformation', function(req, res){
    db.UserInformationModel.findOne({"userId": req.query.userId},function(err,data){
        if(err){
            next(err);}
        else {
            res.send(data);
        }
    });
});

// Create userInformation Doc
app.post('/user_information/create', function(req, res, next){
    var newUserInformation = new db.UserInformationModel({
        userId: req.body.userId,
        uiName: req.body.uiName,
        uiEmail: req.body.uiEmail
    });
    newUserInformation.save(function(err,newUser){
        if (err) { next(err);}
        else {
            res.send(newUser);
        }
    });
});

//=-=-=-= Manage Links =-=-=-=
app.get('/linkList', function(req, res, next){
    db.UserLinksModel.find({objId: req.body}, function(err, linkData){
        if ( err ) { next(err);}
        else {
            res.send(linkData); 
        }
    });
});

app.post('/linkList', function(req, res, next){   
    var newLinkList = new db.UserLinksModel(req.body);
    console.log("linkList Post req.body",req.body);
    newLinkList.save(function(err){ 
        if (err){ next(err);}
        else {
            res.send({success:'success!'});
        }
    });
});

app.post('/linkList/delete', function(req, res, next){
    console.log("DELETE req.body: ", req.body)
    db.UserLinksModel.find({_id: req.body}, function(err, docs){
        if(err) {next(err)}
        else {
            docs[0].remove(function(err){
                if ( err ) { next(err) }
            })
        }
        res.send({success:'success!'})
    })
})


// Client routes
// home page routes
app.get('/', function(req,res){
    res.sendFile('./html/index.html', {root: './public'})
})

// instructions page route
app.get('/instructions', function(req,res){
    res.sendFile('./html/instructions.html', {root: './public'})
})

// dashboard page route
app.get('/dashboard', function(req,res){
    res.sendFile('./html/dashboard.html', {root: './public'})
})

// manage links page route
app.get('/manage-links', function(req,res){
    res.sendFile('./html/manage-links.html', {root: './public'})
})


// manage lists page route
app.get('/manage-lists', function(req,res){
    res.sendFile('./html/manage-lists.html', {root: './public'})
})

// about page route
app.get('/about', function(req,res){
    res.sendFile('./html/about.html', {root: './public'})
})

// ssl
try {
    var httpsConfig = {
        // --- Dev Box SSL
        // key  : fs.readFileSync('/etc/letsencrypt/live/dev.curatingme.com/privkey.pem'), 
        // cert : fs.readFileSync('/etc/letsencrypt/live/dev.curatingme.com/cert.pem')
        // --- Prod Box SSL
        key  : fs.readFileSync('/etc/letsencrypt/live/curatingme.com/privkey.pem'),
        cert : fs.readFileSync('/etc/letsencrypt/live/curatingme.com/cert.pem')
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
    res.redirect('https://curatingme.com' + req.url) // production
    // res.redirect('https://dev.curatingme.com' + req.url) // dev
})
/////////////// SSL End ////////////

// Use the following for Prod and Dev
//listen on port 80
  httpApp.listen(80, function () {
    console.log('Express app listening on port 80');
  });

// app.listen(8000);
