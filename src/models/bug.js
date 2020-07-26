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
    status: {
        type: DataTypes.ENUM,
        values: ['NEW', 'CONFIRMED', 'IN PROGRESS', 'DEVELOPED', 'IN TESTING', 'TESTED', 'CLOSED', 'REJECTED'],
        defaultValue: 'NEW',
        allowNull: false,
    },
    priority: {
        type: DataTypes.ENUM,
        values: ['UNKNOWN', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
        defaultValue: 'UNKNOWN',
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