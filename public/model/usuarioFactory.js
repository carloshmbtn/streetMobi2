/*global angular, console, alert, validar*/
angular.module('app')

/* UsuarioFactory gerencia operações sobre usuarios */
.factory('UsuarioFactory', function($http, $localStorage, $location, AuthService, Config, Upload, $q){
    var urlBase = Config.getUrlBase();

    return {
        logar: function(login, senha){
            $http({method: 'POST', url: '/login', data: {'usuario': {'login': login, 'senha': senha}}}).then(function(dados){
                AuthService.setToken(dados.data);
                $location.path('/');
            },
            function(err){
                if(err.status == '500'){
                    alert('Usuário ou senha incorreto');
                }
            });
        },
        deslogar: function(){
            AuthService.logout();
            $location.path('/login');
        }
    };
});
