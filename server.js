const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const https = require('https');
const fs = require('fs');
const device = require('express-device');

// fs.exists('./public', console.log);
// app.use(require("cors")())
// app.disable('x-powered-by');

app.set('port', process.env.PORT || 8080);
app.use('/3dwebsite', express.static(path.join(__dirname, 'public/3d')));
app.use('/2dwebsite', express.static(path.join(__dirname, 'public/2d')));
app.use(device.capture())

app.get('/', function(req,res){
    console.log("client device: " + req.device.type);
    req.device.type === "desktop" ?
        res.sendFile(__dirname + '/public/3d/html/index.html') :
        res.sendFile(__dirname + '/public/2d/index.html') ;
})

app.listen(app.get("port"), function() {
    console.log(`listening on port ${app.get("port")}`);
});






// var options = {
//   key: fs.readFileSync('key.pem').toString(),
//   cert: fs.readFileSync('cert.pem').toString()
// };

// http.createServer(app).listen(8080);
// Create an HTTPS service identical to the HTTP service.
// https.createServer(options, app).listen(4433, function() {
//
//     console.log("listening");
// });
