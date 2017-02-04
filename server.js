const express = require('express');
const app = express();
const path = require('path');
const device = require('express-device');

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
    console.log("listening on port " + app.get("port"));
});
