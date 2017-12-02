/*global angular*/
var app = angular.module('app');

app.factory('Config', function(){
    var urlBase = 'http://localhost:3000';
    return {
        getUrlBase: function(){
            return urlBase;
        }
    };
});
