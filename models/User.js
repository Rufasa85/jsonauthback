const bcrypt = require("bcrypt");

module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('User', {
        // add properites here
        name: {
            type:DataTypes.STRING,
            allowNull:false
        },
        email: {
            type:DataTypes.STRING,
            unique:true
        },
        password:{
            type:DataTypes.STRING,
            validate:{
                len:[8]
            }
        }
    });

    User.associate = function(models) {
        // add associations here
        User.hasMany(models.Tank);
        User.hasMany(models.Fish);
    };

    User.beforeCreate(function (user) {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
    });

    return User;
};