/*global require, module, __dirname*/



/*inclusoes necessarias para o projeto*/



var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var config    = require('../config');


/* fs é usado para acesasar os arquivos do disco
* path é usado para pegar os diretorios
* Sequelize é um framework ORM
* config utiliza o config.js
*/

var basename  = path.basename(module.filename);
var db        = {};

/* inicializando o sequelize (ORM) */
var sequelize = new Sequelize(config.nomeBanco, config.usuarioBanco, config.senhaBanco, {
    host: config.urlBanco,
    dialect: config.dialeto,
    logging: false,
    storage: config.storage,

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});


/* fs faz um FOR na pasta dos modelos lendo cada um e associando ao Sequelize*/
fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(function(file) {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize; /* guarda uma referencia da instância do Sequelize em db */
db.Sequelize = Sequelize; /* guarda uma referencia para a biblioteca Sequelize */

module.exports = db;
