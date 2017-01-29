const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const https = require('https');
const fs = require('fs')

// fs.exists('./public', console.log);
// console.log(__dirname);

app.set('port', process.env.PORT || 8080);
app.use(express.static('public'));
app.use(require("cors")())

// app.disable('x-powered-by');

app.get('/', (req,res)=>{
    console.log("somthing");
    res.sendFile(__dirname + '/public/index.html')
})

app.listen(app.get("port"), () => {
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
