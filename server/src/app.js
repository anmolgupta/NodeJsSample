var express = require('express'),
    db = require('./model/db'),
    bodyParser = require('body-parser'),
    Users = require('./model/users'),
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


var router = express.Router();

router.use(function(req, res, next) {
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

router.get('/', function(req, res) {
    res.send({ message: 'hooray! welcome to our api!' });   
});

router.get('/th1/', function(req, res) {
    res.send("{ message: 'hooray! welcome to our api!' }");   
});

router.get('/th/', function(req, res) {
    res.json({ message: 'haye! mera to gaand fat gya' });   
});

router.post('/',function(req,res) {
    
    var msg = req.body.name;  
    res.json({message: msg+ ' is a great man'});
    
});

var userRouter = express.Router();
userRouter.post('/addNew',function(req, res){
    
    var users = new Users();
    users.name = req.body.name;  
    users.phoneNumber = req.body.phoneNumber;  
    users.email = req.body.email;  
    users.dob = req.body.dob;
    
    
    users.save(function(err){
        if(err)
            res.send(err)
        res.send("save ho gya bc!")
        
    });
    
});

app.use('/api', router);
app.use('/authentication',authenticationRouter);
app.use('/user',userRouter);

app.listen(port, function(){
    
    console.log('server started');
    console.log('Magic happens on port ' + port);
});

