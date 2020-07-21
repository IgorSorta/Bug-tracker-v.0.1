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
            notEmpty: {
                args: true,
                msg: 'A message has to have a text.'
            }
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