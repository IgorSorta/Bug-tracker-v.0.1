const {
    ForbiddenError
} = require('apollo-server');
const {
    skip
} = require('graphql-resolvers'); // skip - equal to express.js next() func. 


module.exports = {
    // *If user token is correct
    isAuthenticated: (parent, args, {
        me
    }) => me ? skip : new ForbiddenError('You are not authenticated. Please login.'),
    // *If user has an Admin privilege
    isAdmin: (parent, args, {
        me: {
            role
        }
    }) => role === 'ADMIN' ? skip : ForbiddenError('You are not authorized as Admin.'),
    // *If user is message creator
    isMessageOwner: async (parent, {
        id
    }, {
        models,
        me
    }) => {
        const message = await models.Message.findByPk(id, {
            raw: true
        });

        if (message.userId !== me.id) throw new ForbiddenError('You are not authenticated as message owner.');

        return skip;
    },
    // *If user is bug ticket creator
    isBugOwner: async (parent, {
        id
    }, {
        models,
        me
    }) => {
        const bug = await models.Bug.findByPk(id, {
            raw: true
        });

        if (bug.userId !== me.id) throw new ForbiddenError('You are not authenticated as bug owner.')

        return skip;
    },
};