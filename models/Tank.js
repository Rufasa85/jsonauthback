module.exports = function(sequelize, DataTypes) {
    var Tank = sequelize.define('Tank', {
        name:{
            type:DataTypes.STRING,
            allowNull:false
        }
    });

    Tank.associate = function(models) {
        // add associations here
       Tank.hasMany(models.Fish);
       Tank.belongsTo(models.User);
    };

    return Tank;
};