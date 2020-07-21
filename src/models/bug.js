const {
    DataTypes,
    Model
} = require('sequelize');

const sequelize = require('./sequelize');

class Bug extends Model {}
Bug.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
    }
}, {
    sequelize: sequelize,
    modelName: 'bug'
});

module.exports = Bug;