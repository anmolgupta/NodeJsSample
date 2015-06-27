var Users = require('../model/users'),
    db = require('../model/db'),
    express = require('express');

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

module.exports = userRouter;