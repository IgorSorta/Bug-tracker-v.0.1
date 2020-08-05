const sequelize = require('./sequelize');

const User = require('./user');
const Message = require('./message');
const Bug = require('./bug');

// *Gather all models, associat them (see Sequelize doc.) and export
User.hasMany(Message);
User.hasMany(Bug);

Message.belongsTo(User);
Bug.belongsTo(User);

const models = {
    User,
    Message,
    Bug,
};

module.exports = {
    sequelize,
    models,
};