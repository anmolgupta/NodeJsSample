var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
    fName: String,
    lName: String,
    phoneNumber: String,
    email: String,
    dob: Date,
    profilePic : String

}, {strict : true});

userSchema.virtual('fullName').get(function(){

    return this.fName + ' ' + this.lName;
});

userSchema.virtual('fullName').set(function(){

    var split = name.split(' ');
    this.fName = split[0];
    this.lName = split[1];
});

userSchema.set('validateBeforeSave', false);

var userModelToExport =mongoose.model('User', userSchema);

userModelToExport.schema.path('fName').validate(function (value) {

    if(value.length < 5)
        return false;

}, "invalid");

module.exports = userModelToExport;