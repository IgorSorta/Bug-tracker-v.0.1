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
        // *Get all bugs from DB
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
        // *Get bug by its id(uuidv4)
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
        // *Create new bug ticket
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
        // *Change bug ticket status (see bug schema def.)
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
        // *Set bug ticket priority (see bug schema def.)
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
        // *Delete bug ticket by its id(uuidv5)
        deleteBug: combineResolvers(
            isAuthenticated,
            isBugOwner, // check if it bug ticket creator
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
        // if requested bug with user data
        user: async (bug, args, {
            models
        }) => {
            return await models.User.findByPk(bug.userId);
        }
    },
};