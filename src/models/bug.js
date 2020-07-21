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
        validate: {
            notEmpty: {
                args: true,
                msg: 'A bug has have a title.'
            }
        }
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: 'A bug has have a text.'
            }
        }
    },
    userId: {
        type: DataTypes.INTEGER,
    }
}, {
    sequelize: sequelize,
    modelName: 'bug'
});

module.exports = Bug;