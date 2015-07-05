var express = require('express'),
    db = require('./model/db'),
    bodyParser = require('body-parser'),
    userRouter = require('./routers/usersRouter'),
    authenticationRouter = require('./routers/authenticationRouter'),
    morgan      = require('morgan'),
    chatRouter = require('./routers/chatWindowSelection'),
    cors = require('cors'),
    locationRouter = require('./routers/locationRouter');

//    path = require('path'),
//    favicon = require('serve-favicon'),
//    logger = require('morgan'),
//    cookieParser = require('cookie-parser'),
//    bodyParser = require('body-parser'),
//    routes = require('./routes/index'),
//    users = require('./routes/users');


var app = express();
//added to run with localhost
//app.all('/*', function(req, res, next) {
//
//    res.header("Access-Control-Allow-Origin", "*");
//    res.header("Access-Control-Allow-Headers"," Origin, X-Requested-With, Content-Type, Accept");
//    next();
//});

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

var port = process.env.PORT || 8128;

//app.use('/api', router);
app.use('/authentication',authenticationRouter);
app.use('/user',userRouter);
app.use('/location', locationRouter);
app.use('/chat', chatRouter);


var server = require('http').Server(app);
var io = require('socket.io')(server);

var nsp = io.of('/startChat');

nsp.on('connection', function(socket){

    console.log("someone connected");

    nsp.emit('hi', 'eveyone');

    socket.on('write', function(data){

        console.log(data);
        data.timestamp = Date.now();
        nsp.emit('read', data);
        //socket.emit('read', data);
    });
});

server.listen(port, function(){
    
    console.log('server started');
    console.log('Magic happens on port ' + port);
});
/////////////////////------------------------------------------------------------------

//var chatApp = express();
//
//var server = require('http').Server(chatApp);
//var io = require('socket.io')(server);
//
//
//chatApp.use(morgan('dev'));
//chatApp.use(bodyParser.urlencoded({ extended: true }));
//chatApp.use(bodyParser.json());

//var chatPort =  process.env.PORT || 8130;
//
//
//io.on('connection', function(socket) {
//
//    console.log("connection made");
//    socket.emit('read', {name: 'anmol', timestamp:90,msg:'hi' });
//
//});
//
//chatApp.listen(chatPort, function(){
//
//    console.log('chat Application started on' + chatPort);
//});

