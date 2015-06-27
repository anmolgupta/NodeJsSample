var express = require('express'),
    db = require('./model/db'),
    bodyParser = require('body-parser'),
    userRouter = require('./routers/userRouter'),
    authenticationRouter = require('./routers/authenticationRouter');
//    path = require('path'),
//    favicon = require('serve-favicon'),
//    logger = require('morgan'),
//    cookieParser = require('cookie-parser'),
//    bodyParser = require('body-parser'),
//    routes = require('./routes/index'),
//    users = require('./routes/users');


var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8128;

app.use('/api', router);
app.use('/authentication',authenticationRouter);
app.use('/user',userRouter);

app.listen(port, function(){
    
    console.log('server started');
    console.log('Magic happens on port ' + port);
});

