const {
    DataTypes,
    Model,
} = require('sequelize');
const sequelize = require('./sequelize');
const createUUID = require('../helpers/createUUID');

// *Extends base Model by Message
class Message extends Model {}
// *Define model attributes(see Sequilize doc.)
Message.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: () => createUUID(),
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
        type: DataTypes.UUID,
        allowNull: false,
    }
}, {
    sequelize: sequelize,
    modelName: 'message'
});

module.exports = Message;