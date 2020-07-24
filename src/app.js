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

const app = express();
const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    formatError: error => {
        // remove the internal sequelize error message
        // leave only the important validation error
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
        const me = await getMe(req);

        return {
            models: models,
            me: me,
            secret: process.env.SECRET,
        };
    },

});

server.applyMiddleware({
    app,
    path: '/bug'
});

let eraseDatabaseOnSync = true;

sequelize.sync({
    force: eraseDatabaseOnSync
}).then(async () => {

    createFakeData(models);

    app.listen({
        port: 4000
    }, () => {
        console.log('Apollo Server on http://localhost:4000/bug');
    });
});

//
async function createFakeData(models) {
    await models.User.create({
        id: 1,
        name: 'janedoe',
        email: 'jan@mail.com',
        role: 'ADMIN',
        password: 'janedoe'
    }, {
        includes: [models.Message, models.Bug]
    }).then((user) => {
        models.Message.create({
            text: 'after erase message',
            userId: user.id,
        });

        models.Bug.create({
            title: 'Fake title erase',
            description: 'Fake bug description after erase',
            userId: user.id,
        })
    });
}