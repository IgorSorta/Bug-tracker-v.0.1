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
    isBugOwner
} = require('./authorization');

module.exports = {
    Query: {

        bugs: async (parent, args, {
            models
        }) => {
            try {
                return await models.Bug.findAll({
                    order: [
                        ["createdAt", "ASC"]
                    ]
                });
            } catch (error) {
                return error;
            }

        },
        bug: async (parent, {
            id
        }, {
            models
        }) => {
            try {
                if (!id) throw new UserInputError('User must provide bug id');

                const bug = await models.Bug.findByPk(id);
                if (!bug) throw new ApolloError('No bug was found');

                return bug;
            } catch (error) {
                return error;
            }
        },

    },
    Mutation: {
        createBug: combineResolvers(
            isAuthenticated,
            async (parent, {
                title,
                description
            }, {
                me,
                models
            }) => {
                try {
                    if (!title || !description) throw new UserInputError('Bug message must contain title and description');

                    const newBug = await models.Bug.create({
                        title,
                        description,
                        userId: me.id,
                    }, );
                    return newBug;
                } catch (error) {
                    return error;
                }
            }
        ),
        changeStatus: combineResolvers(
            isAuthenticated,
            async (parent, {
                id,
                status
            }, {
                models
            }) => {
                try {
                    if (!id) throw new UserInputError('Input id to change bug status');

                    await models.Bug.update({
                        status: status
                    }, {
                        where: {
                            id: id
                        }
                    });
                    return 'Status changed.'
                } catch (error) {
                    return error;
                }

            }
        ),
        setPriority: combineResolvers(
            isAuthenticated,
            async (parent, {
                id,
                priority
            }, {
                models
            }) => {
                try {
                    await models.Bug.update({
                        priority: priority
                    }, {
                        where: {
                            id: id
                        }
                    });
                    return 'DONE'
                } catch (error) {
                    return error;
                }
            }
        ),
        deleteBug: combineResolvers(
            isAuthenticated,
            isBugOwner,
            async (parent, {
                id
            }, {
                models
            }) => {
                try {
                    if (!id) throw new UserInputError('Input id to delete bug');

                    return await models.Bug.destroy({
                        where: {
                            id
                        }
                    });
                } catch (error) {
                    return error;
                }

            },
        )
    },

    Bug: {
        user: async (bug, args, {
            models
        }) => {
            return await models.User.findByPk(bug.userId);
        }
    },
};