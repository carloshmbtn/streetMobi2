function Usuario(nome, nasc, login, email, senha, file) {
    var nomep = nome;
    nasc = nasc.split("/");
    var nascimentop = new Date(nasc[2], nasc[1] - 1, nasc[0]);
    var loginp = login;
    var emailp = email;
    var senhap = senha;
    var filep = file;

    this.getNome = function(){
        return nomep;
    };

    this.getNascimento = function(){
        return nascimentop;
    };

    this.getLogin = function(){
        return loginp;
    };

    this.getEmail = function(){
        return emailp;
    };

    this.getSenha = function(){
        return senhap;
    };

    this.getFile = function(){
        return filep;
    };
}
/* Model Usuario */
