/*global require, __dirname, console*/

/* importa o pacote express que faz o gerenciamento das rotas*/
var express = require('express'),
    app = express(),
    models = require('./models'),
    routes = require('./routes'),
    bodyParser = require('body-parser');


/* Configuração de diretorios disponiveis */
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

/* Configuração de CORS: Cross-origin resource sharing (CORS)(ou compartilhamento de recursos de origem cruzada)
é uma especificação de uma tecnologia de navegadores que define meios para um servidor permitir que
seus recursos sejam acessados por uma página web de um domínio diferente. */
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Headers', 'authorization');
    next();
});


/* Definição das rotas e dos metodos que tratam elas */

app.post('/usuario', routes.criarUsuario);
app.post('/login', routes.logarUsuario);
app.post('/ponto', routes.valida, routes.cadastrarPonto);
app.get('/pontos', routes.valida, routes.buscarPontos);
app.get('/meusPontos', routes.valida, routes.meusPontos);
app.post('/atualizarPontos', routes.valida, routes.atualizarPontos);
app.get('/teste', routes.valida, routes.teste);

/*definição de relações*/
models.Usuario.hasMany(models.Ponto);
models.Ponto.belongsTo(models.Usuario);

/* Faz a sincronização entre os modelos e o banco de dados */
models.sequelize.sync();
app.listen(3000, function(){
    console.log('ouvindo na porta 3000');
});
