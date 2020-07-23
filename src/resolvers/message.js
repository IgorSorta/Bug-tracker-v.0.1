const {
    ForbiddenError
} = require('apollo-server');
const {
    combineResolvers
} = require('graphql-resolvers');
const {
    isAuthenticated,
    isMessageOwner
} = require('./authorization');

module.exports = {
    Query: {
        messages: async (parent, args, {
            models
        }) => {
            return await models.Message.findAll();
        },
        message: async (parent, {
            id
        }, {
            models
        }) => {
            return await models.Message.findByPk(id)
        },
    },
    Mutation: {
        createMessage: combineResolvers(
            isAuthenticated,
            async (parent, {
                text
            }, {
                me,
                models
            }) => {
                try {
                    const newMess = await models.Message.create({
                        text: text,
                        userId: me.id,
                    });
                    return newMess;
                } catch (error) {
                    throw new Error(error);
                }
            }
        ),
        deleteMessage: combineResolvers(
            isMessageOwner,
            async (parent, {
                id
            }, {
                models
            }) => {
                return await models.Message.destroy({
                    where: {
                        id: id
                    }
                });
            }
        ),
    },
    Message: {
        user: async (message, args, {
            models
        }) => {
            return await models.User.findByPk(message.userId);
        }
    },
};