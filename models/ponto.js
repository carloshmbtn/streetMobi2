/*global module*/
module.exports = function(sequelize, DataTypes){
    var ponto = sequelize.define('Ponto', {
        'descricao': DataTypes.TEXT,
        'latitude': DataTypes.STRING,
        'longitude': DataTypes.STRING,
        'grupoX': DataTypes.INTEGER,
        'grupoY': DataTypes.INTEGER,
        'tipo': DataTypes.STRING
    });
    return ponto;
};
/* Define o modelo Usuario */
