/*global angular, alert*/
angular.module('app')

/* gerencia o armazenamento do token no cliente */
.factory('AuthService', function($localStorage, $location){
    return {
        getToken: function(){
            return $localStorage.token;
        },
        setToken: function(token){
            $localStorage.token = token;
        },
        logout: function(){
            $localStorage.token = null;
            $location.path('/');
        }
    };
})
/* Intecepta as requições */
.factory('AuthInterceptor', function($location, AuthService, $q, $localStorage){
    return{
        request: function(config) {
            config.headers = config.headers || {};
            if (AuthService.getToken()) {
                config.headers.authorization = 'Bearer ' + AuthService.getToken();
            }
            return config;
        },
        responseError: function(response) {
            if (response.status === 401) {
                alert("Sessão expirada");
                $localStorage.token = null;
                $location.path('/login');
            }
            if(response.status === 406){
                $localStorage.token = null;
                $location.path('/login');
            }
            return $q.reject(response);
        }
    };
})
/* Configura o pacote responsável pelas requisições ($http) para utilizar o AuthInterceptor */
.config(function($httpProvider){
    $httpProvider.interceptors.push('AuthInterceptor');
});
