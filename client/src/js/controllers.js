/**
 * Created by anmolgupta on 02/07/15.
 */
var myApp = angular.module('chatControllers',[])
    .constant('URL', 'localhost:8128');

myApp.controller('ListController',['$scope','$http','URL', function($scope, $http, URL){

    $http.get('http://'+ URL+'/chat/all').success(function(data){
        console.log(data);
        $scope.chatList = data;
    })


}]);

myApp.controller('AddNewChat',['$scope','$http','URL',function($scope, $http, URL) {  

    $scope.createNewChat = function(){  
        $http.post('http://'+ URL+'/chat/createNew', 
            {    chatName: $scope.newChatName, 
                userID: $scope.userID 
            },function(data){ 
                console.log(data); 
            }) 
    }; 
}]);

myApp.controller('GoToChatController',['$scope','$http','$routeParams','URL', function($scope,$http,$routeParams,URL){

    console.log($routeParams.chatID);

    var chatID = $routeParams.chatID;
    var userID = $routeParams.userID;

    var socket = io.connect('http://'+URL+'/startChat');

    $scope.messages = [];
    //getting IO parameter in here.


    $scope.send = function(){

        //socket.emit(chatID+'/write', {userId : userID,
        //                                message: $scope.msg}, function(data){
        //
        //    console.log(data);
        console.log($scope.msg);

        socket.emit('write',{name: 'anmol',
                            msg: $scope.msg});
    };

    $scope.leave = function(){

        socket.emit(chatID+'/leave', {userId : userID}, function(data){

            console.log(data);
        });
    };

    socket.on('read', function(data){
        console.log(data);
        $scope.messages.push(data);
    });

    socket.on('hi', function(data){
        console.log(data);
    });

}]);

myApp.controller('LoginController', ['$scope','$http','$window',function($scope,$http,$window) {

    $scope.findLocation = function(){

    };


    $scope.sendLocation = function(){
        http.post('http://'+ URL+'/chat/createNew',
            {
                latitude:$scope.lat,
                longitude:$scope.lon
            },
            function(data){

            });
    };
}]);