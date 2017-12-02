/*global angular*/
angular.module('app')

/* PostFactory gerencia opeçãoes relacionadas a Post*/
.factory('PostFactory', function($http, Upload, Config){
    var urlBase = Config.getUrlBase();
    return {
        listar: function(){
            return $http.get(urlBase + '/post');
        },
        criar: function(post){
            var postp = {
                'descricao': post.getDescricao()
            };
            return Upload.upload({url: urlBase + '/post',data:{'file': post.getImagem(), 'post': postp}});
        },
        buscar: function(id){
            return $http.get(urlBase + '/post/'+id);
        }
    };
});
