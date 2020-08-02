const {
    ForbiddenError,
    AuthenticationError,
    UserInputError,
    ApolloError
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
            try {
                return await models.Message.findAll();
            } catch (error) {
                return error;
            }

        },
        message: async (parent, {
            id
        }, {
            models
        }) => {
            try {
                if (!id) throw new UserInputError('User must provide message id');

                const message = await models.Message.findByPk(id);
                if (!message) throw new ApolloError('No message was found');

                return message;
            } catch (error) {
                return error;
            }
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
            isAuthenticated,
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