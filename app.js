var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var HTTP = require('http');
var HTTPS = require('https'); 
var fs = require('fs');

//ssl
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

//connect to MongoDB
mongoose.connect('mongodb://localhost/curatingMe');
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});

//use sessions for tracking logins
app.use(session({
  secret: 'adoiuend ahsudi',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// serve static files from template
app.use(express.static(__dirname + '/template'));

// include routes
var routes = require('./routes/router');
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});


// listen on port 8000
app.listen(80, function () {
  console.log('Express app listening on port 80');
});