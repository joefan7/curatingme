var express = require('express');
var app = express();
var HTTP = require('http');
var HTTPS = require('https'); 
var fs = require('fs');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var request = require('request');
var Guid = require('guid');
var Mustache  = require('mustache');
var Querystring  = require('querystring');


app.use(express.static('./public'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

var csrf_guid = Guid.raw();

const api_version = "v1.1";
const app_id = "1526244437434268";
const app_secret = '7bc202afc0159c4667887eccb82f148b';
const me_endpoint_base_url = 'https://graph.accountkit.com/v1.0/me';
const token_exchange_base_url = 'https://graph.accountkit.com/v1.0/access_token'; 

function loadLogin() {
    return fs.readFileSync('public/html/login.html').toString();
  }
  
  app.get('/', function(request, response){
    var view = {
      appId: app_id,
      csrf: csrf_guid,
      version: api_version,
    };
  
    var html = Mustache.to_html(loadLogin(), view);
    response.send(html);
  });
  
  function loadLoginSuccess() {
    return fs.readFileSync('public/html/login_success.html').toString();
  }
  
  app.post('/sendcode', function(request, response){
    // CSRF check
    if (request.body.csrf_nonce === csrf_guid) {
      var app_access_token = ['AA', app_id, app_secret].join('|');
      var params = {
        grant_type: 'authorization_code',
        code: request.body.code,
        access_token: app_access_token
        //appsecret_proof: app_secret
      };
    
      // exchange tokens
      var token_exchange_url = token_exchange_base_url + '?' + Querystring.stringify(params);
      Request.get({url: token_exchange_url, json: true}, function(err, resp, respBody) {
        console.log(respBody);
        var view = {
          user_access_token: respBody.access_token,
          expires_at: respBody.expires_at,
          user_id: respBody.id,	
        };
        // get account details at /me endpoint
        var me_endpoint_url = me_endpoint_base_url + '?access_token=' + respBody.access_token;
        Request.get({url: me_endpoint_url, json:true }, function(err, resp, respBody) {
          // send login_success.html
          console.log(respBody);
          if (respBody.phone) {
            view.method = "SMS"
            view.identity = respBody.phone.number;
          } else if (respBody.email) {
            view.method = "Email"
            view.identity = respBody.email.address;
          }
          var html = Mustache.to_html(loadLoginSuccess(), view);
          response.send(html);
        });
      });
    } 
    else {
      // login failed
      response.writeHead(200, {'Content-Type': 'text/html'});
      response.end("Something went wrong. :( ");
    }
  });




// Client routes
// home page route
// app.get('/', function(req,res){
//     res.sendFile('./html/index.html', {root: './public'})
// })

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
