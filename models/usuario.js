/*global module*/
module.exports = function(sequelize, DataTypes){
    var usuario = sequelize.define('Usuario', {
        nome: DataTypes.STRING,
        dataNascimento: DataTypes.DATEONLY,
        login: {
            type: DataTypes.STRING,
            validate: {
                is:{
                    args: /^[a-z0-9_]+$/i,
                    msg: 'Não use caracteres especiais no nome de usuário'
                }
            }
        },
        email: {
            type: DataTypes.STRING,
            validate: {
                isEmail: {
                    args: true,
                    msg: 'Informe um email válido'
                }
            }
        },
        senha: DataTypes.STRING(256),
        imagem: DataTypes.TEXT
    });
    return usuario;
};
/* Define o modelo Usuario */
