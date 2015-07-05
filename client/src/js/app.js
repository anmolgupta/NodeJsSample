/**
 * Created by anmolgupta on 03/07/15.
 */

var myApp = angular.module('myApp', [
    'ngRoute',
    'chatControllers'

]);

//myApp.constant('url', 'localhost:8128');

myApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
        when('/location',{
            templateUrl: 'partials/location.html',
            controller: 'LoginController'
        }).
        when('/chat', {
            templateUrl: 'partials/ChatList.html'
            //controller: 'ListController'
        }).
        when('/chatWindow/:chatID', {
            templateUrl: 'partials/ChatWindow.html',
            controller: 'GoToChatController'
        }).
        otherwise({
            redirectTo: '/chat'
        });
}]);
