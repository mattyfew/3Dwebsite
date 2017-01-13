const express = require('express');
const path = require('path');
const app = express();

app.set('port', process.env.PORT || 8080);
app.use('/static', express.static(path.join(__dirname, 'public')));

app.disable('x-powered-by');

app.get('/', (req,res)=>{
    res.sendFile(__dirname + '/public/index.html')
})
app.listen(app.get("port"), () => {
    console.log(`listening on port ${app.get("port")}`);
});
