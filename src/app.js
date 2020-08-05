'use strict';
const express = require('express');
const {
    ApolloServer
} = require('apollo-server-express');

const schema = require('./schema/index');
const resolvers = require('./resolvers/index');
const {
    models,
    sequelize
} = require('./models/index');
const getMe = require('./helpers/getMe');

// *Define app
const app = express();
// *Define server
const server = new ApolloServer({
    typeDefs: schema, // *user, message, bug schemas
    resolvers, // *query and mutation resolvers
    formatError: error => {
        // *remove the internal sequelize error message
        // *leave only the important validation error
        const message = error.message
            .replace('SequelizeValidationError: ', '')
            .replace('Validation error: ', '');

        return {
            ...error,
            message,
        };
    },
    context: async ({
        req
    }) => {
        // *Gets user from token
        const me = await getMe(req);

        return {
            models: models,
            me: me,
            secret: process.env.SECRET,
        };
    },

});
// *Integrate middleware
server.applyMiddleware({
    app,
    path: '/bug'
});

// !Reset database and request testData(only for testing)
let eraseDatabaseOnSync = true;
const testData = require('../test/testData');

// *Connect to database(MySQL)
sequelize.sync({
    force: eraseDatabaseOnSync
}).then(async () => {

    // !createFakeData(models, new Date());
    testData(models, new Date());

    app.listen({
        port: 4000
    }, () => {
        console.log('Apollo Server on http://localhost:4000/bug');
    });
});