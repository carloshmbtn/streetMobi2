function Post(descricao, imagem){
    var descricaop = descricao,
        imagemp = imagem;

    this.getDescricao = function(){
        return descricaop;
    };
    this.getImagem = function(){
        return imagemp;
    };
}
/* Model post */
