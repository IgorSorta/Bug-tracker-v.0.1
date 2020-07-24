const {
    DataTypes,
    Model
} = require('sequelize');

const sequelize = require('./sequelize');
const createUUID = require('../helpers/createUUID');

class Bug extends Model {}
Bug.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: () => createUUID(),
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
        type: DataTypes.UUID,
        allowNull: false,
    }
}, {
    sequelize: sequelize,
    modelName: 'bug'
});

module.exports = Bug;