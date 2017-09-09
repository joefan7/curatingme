var express     = require('express')
var app         = express()
var HTTP = require('http')
var HTTPS = require('https')
var fs = require('fs')

app.use(express.static('./public'))

app.get('/', function(req, res){
    res.sendFile('./html/index.html', {root:'./public'})
})

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

httpApp.listen(80)