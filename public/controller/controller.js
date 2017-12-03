/*global window, angular, formatarData, alert, console, Usuario, Post*/
var app = angular.module('app');
/* var app recebendo o modulo app do angular */

/* Definindo controladoras, [dependencias( variaveis com $ são do proprio angular)] */
app.controller('appController', ['$scope', 'dados', 'UsuarioFactory' , 'Config', '$window', function($scope, dados, UsuarioFactory, Config, $window){

    $scope.dados = dados;
    $scope.usuario = UsuarioFactory;

    $scope.locate = function(){
        navigator.geolocation.getCurrentPosition($scope.initMap);
    }

    $scope.initMap = function(position) {
        var myLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 3,
            center: myLatLng
        });
        $scope.lat = (myLatLng.lat());
        $scope. lng = (myLatLng.lng());


        var userMarker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            draggable: true
        });
        map.setZoom(17);
        map.panTo(userMarker.position);

        google.maps.event.addListener(userMarker, 'dragend', function (event) {
            $scope.lat = (this.getPosition().lat());
            $scope.lng = (this.getPosition().lng());
        });

    }
    $scope.locate();

}]);


app.controller('registrarController', ['$scope', '$http', '$location', function($scope, $http, $location){
    $scope.registrar = function(nome, login, email, senha, senhaC, necessidade){

        if(senha != senhaC){
            alert('Senha não corresponde a confirmar senha');
            return;
        }

        var usuario = {
            'nome': nome,
            'login': login,
            'email': email,
            'senha': senha,
            'necessidade': necessidade
        };

        $http({method: 'POST', url: '/usuario', data: {'usuario': usuario}}).then(function(dados){
            alert('Registrado com sucesso');
            $location.path('/login');
        },
        function(err){
            alert('Erro ao registrar usuário');
        });

    };
}]);

app.controller('mapController', function($scope, $http){
    $scope.lat = null;
    $scope.lng = null;
    $scope.locate = function(){
        navigator.geolocation.getCurrentPosition($scope.initMap);
    }

    $scope.initMap = function(position) {
        var myLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 3,
            center: myLatLng
        });
        $scope.lat = (myLatLng.lat());
        $scope. lng = (myLatLng.lng());


        var userMarker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            draggable: true
        });
        map.setZoom(17);
        map.panTo(userMarker.position);

        google.maps.event.addListener(userMarker, 'dragend', function (event) {
            $scope.lat = (this.getPosition().lat());
            $scope.lng = (this.getPosition().lng());
        });

    }
    $scope.locate();

    $scope.registrarPonto = function(){
        $http({method: 'POST', url: '/ponto', data: {'latitude': $scope.lat, 'longitude': $scope.lng, 'descricao': $scope.descricao}}).then(
            function(result){
                alert(result.data.msg);
            }
        );
    }
});
