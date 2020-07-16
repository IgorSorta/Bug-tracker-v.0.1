require('dotenv').config();
const Sequelize = require('sequelize');
const user = require('./user');
const message = require('./message');
const bug = require('./bug');

const sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD, {
        dialect: 'mysql'
    },
);

const models = {
    User: user,
    Message: message,
    Bug: bug,
};

Object.keys(models).forEach(key => {
    if ('associate' in models[key]) {
        models[key].associate(models);
    }
});

module.exports = {
    sequelize,
    models
};