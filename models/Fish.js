module.exports = function(sequelize, DataTypes) {
    var Fish = sequelize.define('Fish', {
       name:{
           type:DataTypes.STRING,
           allowNull:false
        },
        width:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        color: {
            type:DataTypes.STRING,
            allowNull:false
        }
    });

    Fish.associate = function(models) {
        // add associations here
        Fish.belongsTo(models.Tank);
        Fish.belongsTo(models.User);
    };

    return Fish;
};