/*global angular*/
var app = angular.module('app', ['ngRoute', 'ngFileUpload','ngStorage']);

app.service('dados', function(){
    this.posts = [];
});

app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "views/index.html",
        controller: "appController",
        authorize: true
    })
    .when("/perfil", {
        templateUrl : "views/perfil.html",
        controller: "perfilController",
        authorize: true
    })
    .when("/perfil/:usuario", {
        templateUrl : "views/perfil.html",
        controller: "perfilPublicController",
        authorize: false
    })
    .when("/registrar", {
        templateUrl: "views/registrar.html",
        controller: "registrarController",
        authorize: false
    })
    .when("/login", {
        templateUrl: "views/login.html",
        controller: "appController",
        authorize: false,
        login: true
    }).when("/busca/:nome", {
        templateUrl: "views/busca.html",
        controller: "buscaController",
        authorize: false
    });
});

app.run(function ($rootScope, $location, $http, AuthService, Config) {
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
        if (next.authorize) {
            /*if (!AuthService.getToken()) {
                $rootScope.$evalAsync(function () {
                    $location.path('/login');
                });
            }*/
            $http.get(Config.getUrlBase() + '/teste');
        }
        if(next.login && AuthService.getToken()){
            $rootScope.$evalAsync(function () {
                $location.path('/');
            });
        }
    });
});
