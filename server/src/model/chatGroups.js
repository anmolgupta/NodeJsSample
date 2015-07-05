/**
 * Created by anmolgupta on 29/06/15.
 */
var mongoose = require('mongoose');
//timestamp can be fetched from  the object id.

var chat = new mongoose.Schema({

    timestamp:{type:Date, default:Date.now},
    msg:String

});

var userInChat = new mongoose.Schema({

    userId:String,
    joiningTimestamp:{type:Date, default:Date.now},
    name:String,
    //leavingTimestamp:Date,
    status:{ type: String, enum: ['inactive', 'active'] },
    chat:[chat]

});

var chatGroupSchema = new mongoose.Schema({

    chatName: String,
    endTimestamp:Date,
    members: [userInChat]

});

module.exports =mongoose.model('ChatGroup', chatGroupSchema);