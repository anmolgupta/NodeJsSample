var mongoose = require('mongoose');  
var userSchema = new mongoose.Schema({  
    fName: String,
    lName: String,
    phoneNumber: String,
    email: String,
    dob: Date,
    profilePic : String
                            
});
module.exports =mongoose.model('User', userSchema);