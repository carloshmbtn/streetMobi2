/*global module*/
module.exports = function(sequelize, DataTypes){
    var post = sequelize.define('Post', {
        descricao: DataTypes.TEXT,
        imagem: DataTypes.TEXT
    });
    return post;
};
/* Define o modelo Post */
