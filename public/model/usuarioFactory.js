/*global angular, console, alert, validar*/
angular.module('app')

/* UsuarioFactory gerencia operações sobre usuarios */
.factory('UsuarioFactory', function($http, $localStorage, $location, AuthService, Config, Upload, $q){
    var urlBase = Config.getUrlBase();

    return {
        logar: function(login, senha){
            $http({method: 'POST', url: urlBase + '/login', data: {'usuario': {'login': login, 'senha': senha}}}).then(function(dados){
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
        },

        registrar: function(usuario, senhaC){
            var deferred = $q.defer();

            if(!validar(usuario.getLogin())){
                deferred.reject('Não use caracteres especiais no nome de usuário');
                return deferred.promise;
            }
            if(usuario.getLogin().length > 20){
                deferred.reject('Login excede o máximo permitido(20)');
                return deferred.promise;
            }
            if(usuario.getSenha().length < 6){
                deferred.reject('Use uma senha que contenha entre 6 e 50 caracteres');
                return deferred.promise;
            }

            var user =
                  {
                      'nome': usuario.getNome(),
                      'dataNascimento': usuario.getNascimento(),
                      'login': usuario.getLogin(),
                      'email': usuario.getEmail(),
                      'senha': usuario.getSenha()
                  };

            Upload.upload({url: urlBase + '/usuario',data:{'file': usuario.getFile(), 'usuario': user}}).then(
                function(dados){
                    if(dados.data.erro){
                        deferred.reject(dados.data.erro.msg);
                    }
                    else{
                        deferred.resolve(dados);
                    }
                },
                function(err){
                    console.log(err);
                    deferred.reject('Erro de comunicação, tente mais tarde');
                },
                function(evt){
                    deferred.notify(evt);
                }
            );

            return deferred.promise;
        },

        adicionarAmigo: function(id){
            return $http.get(urlBase + '/amigo/'+id);
        },

        verificaAmigo: function(id){
            return $http.get(urlBase + '/verificaAmigo/'+id);
        },

        perfil: function(){
            return $http.get(urlBase + '/perfil');
        },

        perfilPublic: function(usuario){
            return $http.get(urlBase + '/perfilPublic/'+usuario);
        },

        buscarPerfil: function(nome){
            return $http.get(urlBase + '/buscarPerfil/'+nome);
        }
    };
});
