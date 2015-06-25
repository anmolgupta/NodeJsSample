var mongoose = require('mongoose');  
var authenticationSchema = new mongoose.Schema({  
    otp: Number,
    startTimestamp: Number,
    endTimestamp: Number,
    phoneNumber: Number
});
module.exports =mongoose.model('Authentication', authenticationSchema);