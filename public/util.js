/*global window, document, setTimeout*/
var validar = function(campo){
    var regex = '[^a-zA-Z0-9_]+';
    if(campo.match(regex)) {
       return false;
    }
    return true;
};

var ir = function(url){
  $('#myModalNorm').modal('hide');
  window.location.href = '/#/registrar';
};

var formatarData = function(data){
    return data.getDate() +
        '/'+parseInt(data.getMonth()+1) +
        '/'+data.getFullYear();
};


//funções de suporte para menu
var openNav = function() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
};

var closeNav = function() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
};
var change = function(local){
    closeNav();
    setTimeout(function(){
        window.location.href = local;
    }, 450);
};

var hideForm = function () {
  $('#myModalNorm').modal('hide');
}
