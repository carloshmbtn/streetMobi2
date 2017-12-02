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
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, datetimestamp + util.gerarId() + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
    }
});

/* Modulo node com implementações das funções utilizadas no servidor */
module.exports = {

    listarPosts: function(req, res){
        models.sequelize.query("SELECT p.descricao as `descricao_post`, p.imagem as `imagem_post`, u2.login as `login_dono` FROM `Posts` p JOIN `UsuarioAmigos` ua ON ua.AmigoId=p.usuario_id JOIN `Usuarios` u ON u.id=ua.UsuarioId JOIN `Usuarios` u2 ON u2.id=ua.AmigoId WHERE u.id=? ORDER BY p.createdAt DESC", { replacements: [parseInt(req.decoded.id)], type: models.sequelize.QueryTypes.SELECT}).then(
            function(posts){
                res.send(posts);
            }
        );
    },

    buscarPost: function(req, res){
        models.Post.findAll({
            where: {
                id: parseInt(req.params.id)
            },
            include: [models.Usuario]
        })
        .then(function(encontrada){
            res.send(encontrada[0]);
        });
    },

    criarPost: function(req, res){
        var post = req.body.post,
            imagem = req.file.filename,
            id = req.decoded.id;
        models.Post.create({
            'descricao': post.descricao,
            'imagem': imagem,
            'usuario_id': id}
        ).then(function(post){
            post.save();
            res.send(post);
        });
    },

    buscarImagem: function(req, res){
        var imagem = req.params.nome;
        res.sendFile(__dirname + '/uploads/' + imagem, null, function(err){
            if(err){
                res.status(err.status).end();
            }
        });
    },

    criarUsuario: function(req, res){
        var usuario = req.body.usuario,
            imagem = req.file.filename;

        function exec(callback){
            if(usuario.senha.length < 6 || usuario.senha.length > 50){
                callback(true, "Use uma senha que contenha entre 6 e 50 caracteres");
            }
            usuario.senha = hash.sha256().update(usuario.senha).digest('hex');
            models.Usuario.findAll(
                {
                    where: {'login': usuario.login}
                }
            ).then(
                function(encontrado){
                    if(encontrado.length > 0){
                        callback(true, "Usuário já existe");
                    }
                    else{
                        models.Usuario.create(
                            {
                                'login': usuario.login,
                                'senha': usuario.senha,
                                'nome': usuario.nome,
                                'dataNascimento': usuario.dataNascimento,
                                'email': usuario.email,
                                'imagem': imagem
                            }
                        ).then(
                            function(usuario){
                                usuario.save().then(
                                    function(u){
                                        u.addAmigo(u);
                                    }
                                );
                                callback(false, usuario);
                            },
                            function(err){
                                callback(true, err.message);
                            }
                        );
                    }
                }
            );
        }

        exec(
            function(err, msg){
                if(!err){
                    res.send(msg);
                }
                else{
                    if(imagem){
                        var filePath = './uploads/'+imagem;
                        fs.unlinkSync(filePath);
                    }
                    res.send({erro: {msg: msg}});
                }
            }
        );
    },

    logarUsuario: function(req, res){
        var usuario = req.body.usuario;
        models.Usuario.findAll(
            {
                where: {login: usuario.login}
            }
        ).then(
            function(encontrado){
                if(encontrado.length > 0 && encontrado[0].senha == hash.sha256().update(usuario.senha).digest('hex')){
                    var token = jwt.sign({
                        login: usuario.login,
                        imagem: encontrado[0].imagem,
                        id: encontrado[0].id},
                        config.jwtKey,
                        {expiresIn: '10m'}
                    );
                    return res.send(token);
                }
                else{
                    res.writeHead(500, {"Content-Type": "application/json"});
                    res.end('');
                }
            }
        );
    },

    perfil: function(req, res){
        var usuario = req.decoded;
        if(usuario){
            res.send(usuario);
        }
        else{
            res.send({'error': 'Erro inesperado'});
        }
    },

    perfilPublic: function(req, res){
        var usuario = req.params.usuario;
        models.Usuario.find({
            where: {
                'login': usuario
            }
        }).then(
            function(usuario){
                res.send(usuario);
            },
            function(err){
                res.send({'error': 'Erro inesperado'});
            }
        );
    },

    buscarPerfil: function(req, res){
        var nome = req.params.nome;
        models.Usuario.findAll({
            attributes: ['nome', 'imagem', 'login'],
            where: {
                'nome': {$like: '%'+nome+'%'}
            }
        }).then(
            function(usuarios){
                res.send(usuarios);
            }
        );
    },


    adicionarAmigo: function(req, res, next){
        var usuario;
        var amigo;

        models.Usuario.findAll({
            where: {
                id: parseInt(req.params.id)
            }
        }).then(
            function(usuarios){
                amigo = usuarios[0];

                models.Usuario.findAll({
                    where: {
                        id: parseInt(req.decoded.id)
                    }
                }).then(
                    function(usuarios){
                        usuario = usuarios[0];
                        if(usuario.id == amigo.id){
                            res.send({error: true, msg: 'Não é possível seguir o próprio perfil'});
                            return;
                        }
                        usuario.addAmigo(amigo).then(
                            function(afetados){
                                if(afetados.length > 0){
                                    res.send({error: false, msg: 'Amigos adicionado'});
                                    return;
                                }
                                res.send({error: true, msg: 'Você já segue essa pessoa'});
                            }
                        );
                    }
                );
            }
        );
    },

    verificaAmigo: function(req, res){
        var key = req.headers.authorization,
            id = req.params.id;
        if(key){
            key = key.split(" ").pop();
            jwt.verify(key, config.jwtKey, function(err, decoded) {
                if (err) {
                    res.send('');
                }
                else{
                    if(decoded.id == id){
                        return res.send({exibeBotao: false, msg: ''});
                    }
                    models.Usuario.findAll({
                        where: {
                            id: decoded.id
                        }
                    }).then(
                        function(usuarios){
                            var eu = usuarios[0];
                            eu.getAmigos().then(
                                function(amigos){
                                    for(a in amigos){
                                        if(amigos[a].id == id){
                                            return res.send({exibeBotao: false, msg: 'Você já segue esse perfil'});
                                        }
                                    }
                                    return res.send({exibeBotao: true, msg: ''});
                                }
                            );
                        }
                    );
                }
            });
        }
        else{
            res.send({exibeBotao: true, msg: ''});
        }
    },

    //middlewares de suporte

    upload: multer({
        storage: storage
    }).single('file'),

    valida: function(req, res, next){
        /* 'Valida' intercepta requisições, verifica se elas são válidas (JWT) e faz um tratamento adequado */
        var key = req.headers.authorization;
        if(key){
            key = key.split(" ").pop();
            jwt.verify(key, config.jwtKey, function(err, decoded) {
                if (err) {
                    res.writeHead(401, {"Content-Type": "application/json"});
                    res.end('');
                }
                else{
                    req.decoded = decoded;
                    next();
                }
            });
        }
        else{
            res.writeHead(406, {"Content-Type": "application/json"});
            res.end('');
        }
    },

    teste: function(req, res){
        res.send('');
    }
};
