/**
 * Created by anmolgupta on 29/06/15.
 */
var ChatGroup = require('../model/chatGroups'),
    express = require('express');

var chatGroupRouter = express.Router();

chatGroupRouter.get('/all', function(req, res) {


    ChatGroup.find({}, function(err, chatGroups) {

        if(err) {
            res.send(err);
            return;
        }

        //res.setHeader('Access-Control-Allow-Origin', '*');
        //
        //// Request methods you wish to allow
        //res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        //
        //// Request headers you wish to allow
        //res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        //
        //// Set to true if you need the website to include cookies in the requests sent
        //// to the API (e.g. in case you use sessions)
        //res.setHeader('Access-Control-Allow-Credentials', true);


        res.send(chatGroups);

    }) ;

});

chatGroupRouter.post('/join', function(req, res) {

    var chatID = req.body.chatID;
    var userID = req.body.userID;

    ChatGroup.findById(chatID, function(err, chatGroup) {

        if(err){
            res.send(err);
            return;
        }

        chatGroup.members.push({userId : userID, status: 'active'});

        chatGroup.save(function(err) {

            if(err){
                res.send(err);
                return;
            }

            res.send({ userId: chatGroup.members[0].id });
        });


    });
});


chatGroupRouter.post('/createNew', function (req, res) {

    var chatName = req.body.chatName;
    var userID = req.body.userID;

    var chatGroup = new ChatGroup();
    chatGroup.chatName = chatName;

    chatGroup.members.push({userId : userID, status: 'active'});

    chatGroup.save(function(err) {
        if(err) {
            res.send(err);
            return;
        }

        //res.send({status: 'successfully created'});
        //res.redirect('/all');
        res.send({chatGroupId: chatGroup.id, userId: chatGroup.members[0].id});

    });
});

chatGroupRouter.post('/sendMsg', function(req,res) {

    var chatID = req.body.chatId;
    var userID = req.body.userId;
});

module.exports = chatGroupRouter;