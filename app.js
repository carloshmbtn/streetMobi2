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
app.get('/post', routes.valida, routes.listarPosts);
app.get('/post/:id' , routes.valida, routes.buscarPost);
app.get('/imagem/:nome', routes.buscarImagem);
app.post('/post', routes.valida, routes.upload, routes.criarPost);
app.post('/usuario', routes.upload, routes.criarUsuario);
app.post('/login', routes.logarUsuario);
app.get('/perfil', routes.valida, routes.perfil);
app.get('/perfilPublic/:usuario', routes.perfilPublic);
app.get('/amigo/:id', routes.valida, routes.adicionarAmigo);
app.get('/verificaAmigo/:id', routes.verificaAmigo);
app.get('/buscarPerfil/:nome', routes.buscarPerfil);
app.get('/teste', routes.valida, routes.teste);

/* relações entre entidades */

models.Usuario.hasMany(models.Post, {foreignKey: 'usuario_id'});
models.Post.belongsTo(models.Usuario, {foreignKey: 'usuario_id'});
models.Usuario.belongsToMany(models.Usuario, {as: 'Amigos', through: models.UsuarioAmigos});

/* Faz a sincronização entre os modelos e o banco de dados */
models.sequelize.sync();
app.listen(3000, function(){
    console.log('ouvindo na porta 3000');
});
