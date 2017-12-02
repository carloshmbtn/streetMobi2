/*global window, angular, formatarData, alert, console, Usuario, Post*/
var app = angular.module('app');
/* var app recebendo o modulo app do angular */

/* Definindo controladoras, [dependencias( variaveis com $ são do proprio angular)] */
app.controller('appController', ['$scope', 'dados', 'UsuarioFactory', 'PostFactory', 'Config', function($scope, dados, UsuarioFactory, PostFactory, Config){
    $scope.dados = dados;
    $scope.usuario = UsuarioFactory;
    $scope.posts = [];

    $scope.buscaPost = function(){
        $scope.url = Config.getUrlBase();
        PostFactory.listar().then(
            function(dados){
                $scope.posts = dados.data;
            }
        );
    };

    $scope.buscaPost();


    UsuarioFactory.perfil().then(
        function(dados){
            $scope.img = Config.getUrlBase() + '/imagem/' + dados.data.imagem;
        },
        function(err){
            if(err.error){
                alert('Erro: ' + err.error);
            }
        }
    );

    $scope.postar = function(file, descricao){
        var post = new Post(descricao, file);
        PostFactory.criar(post).then(
            function(dados){
                alert('Criado com sucesso');
                $scope.buscaPost();
                $scope.file = null;
                $scope.descricao = null;
            }
        );
    };
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

app.controller('registrarController', ['$scope', 'UsuarioFactory', '$location', function($scope, UsuarioFactory, $location){
    $scope.registrar = function(nome, nasc, login, email, senha, senhaC, file){

        if(senha != senhaC){
            alert('Senha não corresponde a confirmar senha');
            return;
        }

        var usuario = new Usuario(nome, nasc, login, email, senha, file);

        UsuarioFactory.registrar(usuario).then(
            function(dados){
                alert('Registrado com sucesso');
                $location.path('/login');
            },
            function(err){
                alert(err);
            },
            function(evt){
                console.log(evt);
            }
        );
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
