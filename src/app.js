'use strict';

const express = require('express');
const {
    ApolloServer
} = require('apollo-server-express');

const main = require('./models/index');
const schema = require('./schema/index');
const resolvers = require('./resolvers/index');
const {
    users
} = require('./models/index');


const app = express();
const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    main,
    context: {
        main,
        me: users[1]
    },

});

server.applyMiddleware({
    app,
    path: '/bug'
});

app.listen({
    port: 4000
}, () => {
    console.log('Apollo Server on http://localhost:4000/bug');
});