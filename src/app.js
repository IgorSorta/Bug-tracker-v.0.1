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
const {
    includes
} = require('./resolvers/index');

const app = express();
const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: async () => ({
        models: models,
        me: await models.User.findByLogin('janedoe'),
    }),

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
    const user = await models.User.create({
        id: 1,
        name: 'janedoe',
        email: 'jan@mail.com',
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