require('dotenv').config();
const Sequelize = require('sequelize');

// *Create a Sequelize instance with connection parameters(see .env)
const sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD, {
        dialect: 'mysql',
        logging: false,
    },
);

module.exports = sequelize;