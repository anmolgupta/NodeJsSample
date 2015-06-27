var express = require('express'),
    db = require('./model/db'),
    bodyParser = require('body-parser'),
    Users = require('./model/users');
//    path = require('path'),
//    favicon = require('serve-favicon'),
//    logger = require('morgan'),
//    cookieParser = require('cookie-parser'),
//    bodyParser = require('body-parser'),
//    routes = require('./routes/index'),
//    users = require('./routes/users');

var client = require('twilio')('ACbdc623869e0f0056e24688e243c97b06 ',
                               'd33245731b3e4c2d7dd14ceaf677501f ');


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

function validatePhoneNumber(phoneNumber) {
    if(!phoneNumber)
        return false;
    
    if(phoneNumber.length == 10 && !isNaN(phoneNumber))
        return true;
        
    return false;
}

function createOTP() {

    var random = Math.random();
    random *= 10000; 
    random = parseInt(random);
    return random;
}

function padDigits(digits, number) {
    if(number.length >= digits)
        return number;
    
    else{
        var numOf0s = digits - number.length;
        for(var i = 0; i < numOf0s; i++)
            number = '0' + number;
    }
    
    return number;
}

function sendOTP(phoneNumber, otp, callbackMethod) {
    client.sendMessage({
        to:'+91 '+phoneNumber, 
        from:'+1 415-599-2671',
        body:'9455-4193 YOUR OTP is : ' + padDigits(4,otp)
    },function(error, message) {
        callbackMethod(error,message);
    });
}


var authenticationRouter = express.Router();

authenticationRouter.post('/', function(req, res) { //posting the phone NUmber
    
    var phoneNumber = req.body.phoneNumber;
    
    if(!validatePhoneNumber(phoneNumber)){
        res.send({error:"Not a valid Telephone Number"});
        return;
    }
    
    
    var otp = createOTP();
    
    var callbackMethod = function(err,msg) {
    
            if (err)
                res.send({error:"Cannot send. Incorrect Phone NUmber. Please Try again later."});
//                res.send(error);
            else {        
                //saving authentication in mongo
                var initialAuthentication = new Authentication();
                initialAuthentication.otp = otp;
                var currentTimestamp = new Date().getTime();
                initialAuthentication.startTimestamp = currentTimestamp;
                initialAuthentication.endTimestamp = currentTimestamp + (30*60*1000);
                initialAuthentication.phoneNumber = phoneNumber;

                initialAuthentication.save(function(err){
                    if(err)
                        res.send(err);

                    res.send({authenticationToken : "" + initialAuthentication.id});
                });
            }
    
    };
    
    sendOTP(phoneNumber, otp, callbackMethod);
   
});


authenticationRouter.get('/reOTP',function(res,req){
    
    var authenticationToken = req.body.authentication;
    
    Authentication.findById(authenticationToken, function(err, auth) {
        
        if(err)
            res.send({error:"Invaid Authentication"});
        
        var otp;
        do{
            otp = createOTP();
        
        }while(otp != auth.otp);
        
        var callbackMethod = function(error, msg) {
            if(error) 
                res.send({error: "Problem in sending Message. Please Resend"});
            
            auth.otp = otp;
            auth.save(function(err) {
                if(err) 
                    res.send({error: "Please Try again"});
                
                res.send({status: "successfully sent!"});
                
            });
            
        }
        sendOTP(auth.phoneNumber, otp, callbackMethod);        
    
    });
});

authenticationRouter.post('/confirmOTP', function(req, res){
    
    var authenticationToken = req.body.authentication;
    var otp = req.body.otp;
    
    Authentication.findById(authenticationToken, function(err, auth) {
        
        if(err)
            res.send(err);
        
        if(auth.otp != otp) 
            res.send({error:"OTP doesn't match."});
        
        auth.startTimestamp = auth.endTimestamp;
        auth.save(function(err) {
            if(err) 
                res.send(err);
            
            res.send({status:"Success"});
        })  
    })
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

