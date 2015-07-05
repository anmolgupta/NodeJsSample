/**
 * Created by anmolgupta on 05/07/15.
 */
var Location = require('../model/location'),
    express = require('express'),
    ChatGroup = require('../model/chatGroups');

var locationRouter = express.Router();

locationRouter.post('/find', function(req, res) {

    var distance = parseFloat(req.body.dist);
    var lat = parseFloat(req.body.lat);
    var lon = parseFloat(req.body.lon);

    console.log(lon+", "+lat);

    Location.find({ loc: { '$near': {
        '$maxDistance': distance,
        '$geometry': { type: 'Point', coordinates: [ lon, lat ] } } }
    }, function(err,result) {
        if(err){

            res.send(err);
            return;
        }


       console.log("length: "+result.length);

        res.send(result);
    });


});


locationRouter.post('/createNew', function(req, res){


    var userData = req.body.userData;

    var location = new Location(userData);

    var createNewChat = function(){

        var chatGroup = new ChatGroup();

        chatGroup.members.push({ name : location.name, status: 'active'});

        chatGroup.save(function(err) {
            if(err) {
                res.send(err);
                return;
            }

            location.chatUrl = chatGroup.id;

            location.save(function(err){
                if(err)
                {
                    res.send(err);
                    return;
                }

                res.send({
                            userID: location.id,
                            chatUrl : location.chatUrl
                        });

            });

        });

    };

    var addUserInPreviousChat = function( chatURL){

        location.chatUrl = chatURL;

        location.save(function(err) {

            if(err)
            {
                res.send(err);
                return;
            }

            ChatGroup.findById(chatURL, function(err, chatGroup){

                if(err){
                    console.log(err);
                    return;
                }

                chatGroup.members.push({ name : location.name, status: 'active'});
                chatGroup.save(function(err){

                    if(err){
                        console.log(err);
                        return;
                    }

                    res.send({
                        userID:location.id,
                        chatUrl: chatURL
                    });


                });
            });

        });



    };


    var findInMongoForUser = function(err, result) {

        if(err) {
            res.send(err);
            return;
        }

        if(result.length == 0 ) {

            createNewChat();


        } else
        if(result.length > 0){

            addUserInPreviousChat( result[0].chatUrl);
        }
    };

    Location.find({ loc: { '$near': {
        '$maxDistance': 2000,
        '$geometry': { type: 'Point', coordinates: [ location.loc[0], location.loc[1] ] } } }
    },function(err,result){
        findInMongoForUser(err,result);
    });

});

module.exports = locationRouter;

