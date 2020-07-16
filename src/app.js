'use strict';

const express = require('express');
const {
    ApolloServer
} = require('apollo-server-express');


const schema = require('./schema/index');
const resolvers = require('./resolvers/index');
const {
    models,
    sequelize,
} = require('./models/index');


const app = express();
const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: async () => ({
        models,
        me: models.User.findByLogin('John'),
    }),

});


server.applyMiddleware({
    app,
    path: '/bug'
});

const eraseDatabaseOnSync = true;

sequelize.sync({
    force: eraseDatabaseOnSync
}).then(async () => {

    if (eraseDatabaseOnSync) {
        createUserWithMessages();
    }

    app.listen({
        port: 4000
    }, () => {
        console.log('Apollo Server on http://localhost:4000/bug');
    });
});

const createUserWithMessages = async () => {
    await models.User.create({
        name: 'John',
        messages: [{
            text: 'Test message from John'
        }, ],
        bugs: [{
            title: 'Bug no.1',
            text: 'Bug no.1 in register form...'
        }],
    }, {
        include: [models.Message, models.Bug],
    }, );

    await models.User.create({
        name: 'Mark',
        messages: [{
            text: 'Test message from Mark'
        }, ],
        bugs: [{
            title: 'Bug no.20',
            text: 'Bug no.20 in login form...'
        }],
    }, {
        include: [models.Message, models.Bug],
    }, )
};