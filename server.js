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

// ssl
var httpApp = express()
httpApp.use(function(req, res){
    console.log(req.url)
    res.redirect('https://dev.curatingme.com' + req.url)
})

try {
    var httpsConfig = {
        key  : fs.readFileSync('/etc/letsencrypt/live/dev.curatingme.com/privkey.pem'),
        cert : fs.readFileSync('/etc/letsencrypt/live/dev.curatingme.com/cert.pem')
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
    res.redirect('https://dev.curatingme.com' + req.url)
})
/////////////// SSL End ////////////

// Client routes
// home page route
app.get('/', function(req,res){
    res.sendFile('./html/index.html', {root: './public'})
})


// listen on port 80
  app.listen(80, function () {
    console.log('Express app listening on port 80');
  });
