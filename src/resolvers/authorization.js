const {
    ForbiddenError
} = require('apollo-server');
const {
    skip
} = require('graphql-resolvers');

module.exports = {
    isAuthenticated: (parent, args, {
        me
    }) => me ? skip : new ForbiddenError('You are not authenticated. Please login.'),
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