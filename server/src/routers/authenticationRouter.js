var Authentication = require('../model/authentication'),
    twilioClient = require('twilio')('ACbdc623869e0f0056e24688e243c97b06 ',
                               'd33245731b3e4c2d7dd14ceaf677501f '),
    express = require('express'),
    jwt    = require('jsonwebtoken'),
    key = 'anmol';

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
    
    twilioClient.sendMessage({
        to:'+91 '+phoneNumber, 
        from:'+1 415-599-2671',
        body:'9455-4193 YOUR OTP is : ' + padDigits(4,otp.toString())
    },function(error, message) {
        callbackMethod(error,message);
    });
}

function findAuthenticationById(id, callback) {

    Authentication.findById(id, function(err,auth) {
        callback(err,auth);
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
    console.log("otp : "+otp);
    
    var callbackMethod = function(err,msg) {
    
            if (err)
                res.send({error:"Cannot send. Incorrect Phone NUmber. Please Try again later."});

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

                    var dummy = {};
                    
                    dummy.id = initialAuthentication.id;

                    var token = jwt.sign(dummy, key, {
                                    expiresInMinutes: 30 // expires in 24 hours
                                });
                    
                    res.send({token : token});
                });
            }
    
    };
    
    sendOTP(phoneNumber, otp, callbackMethod);
   
});

var authenticationVerification = function(req, res, next) {
    
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {


      // verifies secret and checks exp
      jwt.verify(token, key, function(err, decoded) {
          if (err) {

              return res.json({ error: 'Failed to authenticate token.' });

          } else {

              var callback = function(err, auth){

                  if(err) {
                      res.send({error:"Error in authentication"});
                      return;
                  }

                  res.auth = auth;
                  next();

              };

              findAuthenticationById(id, callback);
          }

      });
  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
};

authenticationRouter.use('/confirmOTP', authenticationVerification);
authenticationRouter.use('/reOTP', authenticationVerification);

authenticationRouter.get('/reOTP',function(req,res){
    
    
    Authentication.findById(req.decoded._id, function(err, auth) {
        
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
    
    var otp = req.body.otp;
    
    if(otp == req.auth.otp) {
           
        res.send({status:'success', message:'OTP Confirmed Successfully'});
        console.log(req.decoded);
        return;
    }
   
    console.log(req.decoded);
    res.send({error : "Error!!!"})
   
//    Authentication.findById(authenticationToken, function(err, auth) {
//        
//        if(err)
//            res.send(err);
//        
//        if(auth.otp != otp) 
//            res.send({error:"OTP doesn't match."});
//        
//        auth.startTimestamp = auth.endTimestamp;
//        auth.save(function(err) {
//            if(err) 
//                res.send(err);
//            
//            res.send({status:"Success"});
//        });  
//    });
});

module.exports = authenticationRouter;