/*global window, angular, formatarData, alert, console, Usuario, Post*/
var app = angular.module('app');
/* var app recebendo o modulo app do angular */

/* Definindo controladoras, [dependencias( variaveis com $ são do proprio angular)] */
app.controller('appController', ['$scope', 'dados', 'UsuarioFactory' , 'Config', function($scope, dados, UsuarioFactory, Config){
    $scope.dados = dados;
    $scope.usuario = UsuarioFactory;

}]);

app.controller('perfilController', ['$scope', 'Config', 'dados', 'UsuarioFactory', function($scope, Config, dados, UsuarioFactory){
    $scope.dados = dados;
    $scope.usuario = UsuarioFactory;

    UsuarioFactory.perfil().then(
        function(dados){
            window.location.href = '/#/perfil/'+dados.data.login;
        },
        function(err){
            if(err.error){
                alert('Erro: ' + err.error);
            }
        }
    );
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

app.controller('perfilPublicController', ['$scope', '$routeParams', 'UsuarioFactory', 'Config', function($scope, $routeParams, UsuarioFactory, Config){
    var username = $routeParams.usuario;
    UsuarioFactory.perfilPublic(username).then(
        function(dados){
            $scope.perfil = dados.data;
            $scope.url = Config.getUrlBase() + '/imagem/'+ $scope.perfil.imagem;
            var data = new Date($scope.perfil.dataNascimento);
            $scope.perfil.dataNascimento = formatarData(data);

            $scope.verificaAmigo($scope.perfil.id);
        }
    );

    $scope.verificaAmigo = function(id){
        UsuarioFactory.verificaAmigo(id).then(
            function(result){
                var resposta = result.data;
                $scope.mensagem = resposta.msg;
                if(resposta.exibeBotao){
                    $scope.exibeBotao = true;
                }
                else{
                    $scope.exibeBotao = false;
                }
            }
        );
    }

    $scope.addAmigo = function(id){
        UsuarioFactory.adicionarAmigo(id).then(
            function(result){
                if(result.data.error){
                    alert('Erro: '+result.data.msg);
                }
                else{
                    alert(result.data.msg);
                }
                $scope.verificaAmigo(id);
            }
        );
    }

}]);

app.controller('buscaController', ['$scope', '$routeParams', 'UsuarioFactory', 'Config', function($scope, $routeParams, UsuarioFactory, Config){
    var nome = $routeParams.nome;
    UsuarioFactory.buscarPerfil(nome).then(
        function(result){
            $scope.url = Config.getUrlBase();
            $scope.usuarios = result.data;
        }
    );
}]);
