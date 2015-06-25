var    Authentication = require('../model/authentication');

var twilioClient = require('twilio')('ACbdc623869e0f0056e24688e243c97b06 ',
                               'd33245731b3e4c2d7dd14ceaf677501f ');
function createOTP() {

    var random = Math.random();
    random *= 10000; 
    random = parseInt(random);
    return random;
}

function sendOTP(phoneNumber, otp, callbackMethod) {
    client.sendMessage({
        to:'+91 '+phoneNumber, 
        from:'+1 415-599-2671',
        body:'9455-4193 YOUR OTP is : ' + random
    },function(error, message) {
        callbackMethod(error,message);
    });
}

function validatePhoneNumber(phoneNumber) {
    if(!phoneNumber)
        return false;
    
    if(phoneNumber.length == 10 && !isNaN(phoneNumber))
        return true;
        
    return false;
}

var authenticationRouter = express.Router();

authenticationRouter.post('/', function(req, res) { //posting the phone NUmber
   
    var otp = createOTP();
    
    var phoneNumber = req.body.phoneNumber;
    
    if(!validatePhoneNumber(phoneNumber))
        res.send({error:"Not a valid Telephone Number"});
    
    var callbackMethod = function(error,msg) {
    
            if (error)
                res.send({error:"Cannot send. Incorrect Phone NUmber. Please Try again later."})
//                res.send(error);
            else {        
                //saving authentication in mongo
                var initialAuthentication = new Authentication();
                initialAuthentication.otp = random;
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
    
    }
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

