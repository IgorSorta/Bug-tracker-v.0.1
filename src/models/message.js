const {
    DataTypes,
    Model,
} = require('sequelize');
const sequelize = require('./sequelize');

class Message extends Model {}
Message.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    text: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    userId: {
        type: DataTypes.INTEGER
    }
}, {
    sequelize: sequelize,
    modelName: 'message'
});

module.exports = Message;