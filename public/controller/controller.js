/*global window, angular, formatarData, alert, console, Usuario, Post*/
var app = angular.module('app');
/* var app recebendo o modulo app do angular */

/* Definindo controladoras, [dependencias( variaveis com $ são do proprio angular)] */
app.controller('appController', ['$scope', 'dados', 'UsuarioFactory', 'Config', '$window', '$http', function($scope, dados, UsuarioFactory, Config, $window, $http) {

    $scope.dados = dados;
    $scope.usuario = UsuarioFactory;

    $scope.pontos = [];
    const cor = [
        'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
        'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
    ];

    $http.get('/pontos').then(
        function(result) {
            $scope.pontos = result.data;

            $scope.locate = function() {
                navigator.geolocation.getCurrentPosition($scope.initMap);
            }

            $scope.initMap = function(position) {
                var myLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

                var map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 3,
                    center: myLatLng
                });
                $scope.lat = (myLatLng.lat());
                $scope.lng = (myLatLng.lng());

                for (i in $scope.pontos) {
                    console.log($scope.pontos[i].tipo);
                    var userMarker = new google.maps.Marker({
                        position: { 'lat': parseFloat($scope.pontos[i].latitude), 'lng': parseFloat($scope.pontos[i].longitude) },
                        map: map,
                        draggable: false,
                        title: $scope.pontos[i].descricao,
                        icon: cor[$scope.pontos[i].tipo]
                    });

                    pog(i, userMarker);

                }

                function pog(i, userMarker) {
                    var infowindow = new google.maps.InfoWindow({
                        content: '<h4>' + $scope.pontos[i].descricao + '</h4>'
                    });


                    userMarker.addListener('click', function() {
                        infowindow.open(map, userMarker);
                    });
                }

                var userMarker = new google.maps.Marker({
                    position: myLatLng,
                    map: map,
                    draggable: false,
                    visible: false
                });
                map.setZoom(17);
                map.panTo(userMarker.position);

            }
            $scope.locate();
        }
    );
}]);


app.controller('registrarController', ['$scope', '$http', '$location', function($scope, $http, $location) {
    $scope.registrar = function(nome, login, email, senha, senhaC, necessidade) {

        if (!senha || senha != senhaC) {
            alert('Senha não corresponde a confirmar senha');
            return;
        }
        if(email && email.search('@') < 0 && email.search('.') < 0){
            alert('Email não é válido!!');
            return;
        }

        console.log(necessidade);

        if(!nome || !login || !necessidade || !email){
            alert('Informe todos os campos!!!');
            return;
        }

        var usuario = {
            'nome': nome,
            'login': login,
            'email': email,
            'senha': senha,
            'necessidade': necessidade
        };

        $http({ method: 'POST', url: '/usuario', data: { 'usuario': usuario } }).then(function(dados) {
                if(dados.data.erro){
                    alert(dados.data.erro.msg);
                }
                else{
                    alert('Registrado com sucesso');
                    $location.path('/login');
                }
            },
            function(err) {
                alert('Erro ao registrar usuário');
            });

    };
}]);

app.controller('mapController', function($scope, $http) {
    $scope.lat = null;
    $scope.lng = null;
    $scope.tipo = '0';
    $scope.locate = function() {
        navigator.geolocation.getCurrentPosition($scope.initMap);
    }

    $scope.initMap = function(position) {
        var myLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 3,
            center: myLatLng
        });
        $scope.lat = (myLatLng.lat());
        $scope.lng = (myLatLng.lng());


        var userMarker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            draggable: true
        });
        map.setZoom(17);
        map.panTo(userMarker.position);

        google.maps.event.addListener(userMarker, 'dragend', function(event) {
            $scope.lat = (this.getPosition().lat());
            $scope.lng = (this.getPosition().lng());
        });

    }
    $scope.locate();

    $scope.registrarPonto = function() {
        $http({
            method: 'POST',
            url: '/ponto',
            data: {
                'latitude': $scope.lat,
                'longitude': $scope.lng,
                'descricao': $scope.descricao,
                'tipo': $scope.tipo
            }
        }).then(
            function(result) {
                alert(result.data.msg);
            }
        );
    }
});

app.controller("updateController", function($scope, $http) {
    $scope.pontos = [];
    const cor = [
        'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
        'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
    ];
    $http.get('/meusPontos').then(
        function(result) {
            $scope.pontos = result.data.Pontos;

            $scope.locate = function() {
                navigator.geolocation.getCurrentPosition($scope.initMap);
            }

            $scope.initMap = function(position) {
                var myLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

                var map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 3,
                    center: myLatLng
                });
                $scope.lat = (myLatLng.lat());
                $scope.lng = (myLatLng.lng());

                for (i in $scope.pontos) {
                    var userMarker = new google.maps.Marker({
                        position: { 'lat': parseFloat($scope.pontos[i].latitude), 'lng': parseFloat($scope.pontos[i].longitude) },
                        map: map,
                        draggable: true,
                        title: $scope.pontos[i].descricao,
                        icon: cor[$scope.pontos[i].tipo]
                    });

                    pog(i, userMarker);

                }

                function pog(i, userMarker) {
                    var infowindow = new google.maps.InfoWindow({
                        content: '<h4>' + $scope.pontos[i].descricao + '</h4>'
                    });


                    userMarker.addListener('click', function() {
                        infowindow.open(map, userMarker);
                    });

                    google.maps.event.addListener(userMarker, 'dragend', function(event) {
                        /*console.log(this.getPosition().lat());
                        console.log(this.getPosition().lng());
                        console.log(i);*/
                        $scope.pontos[i].latitude = this.getPosition().lat();
                        $scope.pontos[i].longitude = this.getPosition().lng();
                    });
                }

                var userMarker = new google.maps.Marker({
                    position: myLatLng,
                    map: map,
                    draggable: false,
                    visible: false
                });
                map.setZoom(17);
                map.panTo(userMarker.position);

            }
            $scope.locate();
        }
    );

    $scope.salvar = function() {
        $http({ method: 'post', data: { 'pontos': $scope.pontos }, url: '/atualizarPontos' }).then(
            function(result) {
                alert('Pontos atualizados com sucsso!');
            }
        );
    }
});
