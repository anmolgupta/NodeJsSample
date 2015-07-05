var Users = require('../model/users'),
    express = require('express');

var userRouter = express.Router();

userRouter.post('/addNew',function(req, res){
    
    var users = new Users();
    users.fName = req.body.fName;
    users.lName = req.body.lName;
    users.phoneNumber = req.body.phoneNumber;  
    users.email = req.body.email;  
    users.dob = req.body.dob;
    users.profilePic = req.body.profilePic;
    
    users.save(function(err){
        if(err)
            res.send(err);


        res.send({id : users.id});
        
    });
    
});

module.exports = userRouter;