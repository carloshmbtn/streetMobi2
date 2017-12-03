/*global require, module, __dirname*/

var models = require('./models'),
    jwt = require('jsonwebtoken'),
    multer = require('multer'),
    util = require('./util'),
    config = require('./config'),
    fs = require('fs'),
    hash = require('hash.js');
/* models importa os modelos
 * jwt é utilizado para gerenciamento de tokens para autenticação
 * multer utilizado para upload de imagens
 *
 */


/* Configuração de local de armazenamento */
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, datetimestamp + util.gerarId() + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
    }
});

/* Modulo node com implementações das funções utilizadas no servidor */
module.exports = {




    criarUsuario: function(req, res) {
        var usuario = req.body.usuario;

        function exec(callback) {
            if (usuario.senha.length < 6 || usuario.senha.length > 50) {
                callback(true, "Use uma senha que contenha entre 6 e 50 caracteres");
            }
            usuario.senha = hash.sha256().update(usuario.senha).digest('hex');
            models.Usuario.findAll({
                where: { 'login': usuario.login }
            }).then(
                function(encontrado) {
                    if (encontrado.length > 0) {
                        callback(true, "Usuário já existe");
                    } else {
                        models.Usuario.create({
                            'login': usuario.login,
                            'senha': usuario.senha,
                            'nome': usuario.nome,
                            'email': usuario.email,
                            'necessidade': usuario.necessidade
                        }).then(
                            function(usuario) {

                                callback(false, usuario);
                            },
                            function(err) {
                                callback(true, err.message);
                            }
                        );
                    }
                }
            );
        }

        exec(
            function(err, msg) {
                if (!err) {
                    res.send(msg);
                } else {

                    res.send({ erro: { msg: msg } });
                }
            }
        );
    },

    logarUsuario: function(req, res) {
        var usuario = req.body.usuario;
        models.Usuario.findAll({
            where: { login: usuario.login }
        }).then(
            function(encontrado) {
                if (encontrado.length > 0 && encontrado[0].senha == hash.sha256().update(usuario.senha).digest('hex')) {
                    var token = jwt.sign({
                            login: usuario.login,
                            id: encontrado[0].id
                        },
                        config.jwtKey, { expiresIn: '10m' }
                    );
                    return res.send(token);
                } else {
                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.end('');
                }
            }
        );
    },


    //middlewares de suporte

    upload: multer({
        storage: storage
    }).single('file'),

    valida: function(req, res, next) {
        /* 'Valida' intercepta requisições, verifica se elas são válidas (JWT) e faz um tratamento adequado */
        var key = req.headers.authorization;
        if (key) {
            key = key.split(" ").pop();
            jwt.verify(key, config.jwtKey, function(err, decoded) {
                if (err) {
                    res.writeHead(401, { "Content-Type": "application/json" });
                    res.end('');
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            res.writeHead(406, { "Content-Type": "application/json" });
            res.end('');
        }
    },

    cadastrarPonto: function(req, res) {

        const id = req.decoded.id;

        var ponto = {
            descricao: req.body.descricao,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            tipo: req.body.tipo,
            grupoX: '1',
            grupoY: '1'
        };

        models.Usuario.findById(id).then(
            function(u) {
                models.Ponto.create(ponto).then(
                    function(p) {
                        u.addPontos([p]);
                        res.send({ 'erro': false, 'msg': 'Cadastrado com suceso!' });
                    },
                    function(err) {
                        res.send({ 'erro': true, 'msg': 'Erro: ' + err });
                    }
                );
            }
        )
    },

    buscarPontos: function(req, res) {
        models.Ponto.findAll().then(
            function(pontos) {
                res.send(pontos);
            }
        );
    },

    meusPontos: function(req, res) {
        const id = req.decoded.id;

        models.Usuario.find({
            'where': { 'id': id },
            'include': [models.Ponto]
        }).then(
            function(u) {
                res.send(u);
            }
        );
    },

    atualizarPontos: function(req, res) {
        var pontos = req.body.pontos;

        function pogRep() {
            if (pontos.length > 0) {
                var final = pontos.pop();

                //delete final.createdAt;
                //delete final.updatedAt;

                models.Ponto.findById(final.id).then(
                    function(p) {
                        p.updateAttributes(final).then(
                            function() {
                                pogRep();
                            }
                        );
                    }
                );
            } else {
                res.send('Deu tudo certo!!');
            }
        }
        pogRep();
    },

    teste: function(req, res) {
        res.send('');
    }
};