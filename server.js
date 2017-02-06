const express = require('express');
const app = express();
const path = require('path');
const device = require('express-device');
const hbs = require('express-handlebars');
const favicon = require('serve-favicon');

app.set('port', process.env.PORT || 8080);
app.use('/3dwebsite', express.static(path.join(__dirname, 'public/3d')));
app.use('/2dwebsite', express.static(path.join(__dirname, 'public/2d')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(device.capture())

app.use(favicon(path.join(__dirname,'public','img','favicon.png')));

app.engine('handlebars', hbs({
    layoutsDir: './public/2d/views/layouts',
    partialsDir: './public/2d/views/partials',
    defaultLayout: 'default'
}));
app.set('views', __dirname + '/public/2d/views');
app.set('view engine', 'handlebars');

app.get('/', function(req,res){
    console.log("client device: " + req.device.type);
    req.device.type === "desktop" ?
        res.sendFile(__dirname + '/public/3d/html/index.html') :
        res.render('./index.handlebars', { data : require('./public/data.json') }) ;
})

app.listen(app.get("port"), function() {
    console.log("listening on port " + app.get("port"));
});
