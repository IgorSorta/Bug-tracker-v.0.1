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
    context: {
        models,
        //me: users[1]
    },

});

server.applyMiddleware({
    app,
    path: '/bug'
});

sequelize.sync().then(async () => {

    app.listen({
        port: 4000
    }, () => {
        console.log('Apollo Server on http://localhost:4000/bug');
    });
});