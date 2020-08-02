const createToken = require('../helpers/createToken');

const {
    AuthenticationError,
    UserInputError,
    ApolloError,
    ForbiddenError
} = require('apollo-server');
const {
    combineResolvers
} = require('graphql-resolvers');
const {
    isAuthenticated,
    isAdmin
} = require('./authorization');

module.exports = {
    Query: {
        me: async (parent, args, {
            me,
            models
        }) => {
            try {
                if (!me) {
                    throw new ForbiddenError('You are not authenticated. Please login.');
                }

                const user = await models.User.findByPk(me.id);
                if (!user) throw new ApolloError('No user was found.');

                return user;
            } catch (error) {
                return error;
            }

        },
        user: async (parent, {
            id
        }, {
            models
        }) => {
            try {
                if (!id) throw new UserInputError('User must provide id');

                const user = await models.User.findByPk(id);
                if (!user) throw new ApolloError('No user was found.');

                return user;
            } catch (error) {
                return error;
            }

        },
        users: async (parent, args, {
            models
        }) => {
            try {
                return await models.User.findAll({
                    order: [
                        ["createdAt", "ASC"]
                    ]
                });
            } catch (error) {
                return error;
            }

        }
    },
    Mutation: {
        signUp: async (parent, {
            name,
            email,
            password
        }, {
            models,
            secret
        }) => {
            try {
                if (!name) throw new UserInputError('User must provide name');
                if (!email) throw new UserInputError('User must provide email');
                if (!password) throw new UserInputError('User must provide password');

                const user = models.User.create({
                    name: name,
                    email: email,
                    password: password
                });
                if (!user) throw new Error('SignUp error: User.create!');

                return {
                    token: createToken(user, secret, '30m')
                };
            } catch (error) {
                return error;
            }

        },
        signIn: async (parent, {
            login: login,
            password: password
        }, {
            models,
            secret
        }) => {
            try {
                if (!login || !password) throw new UserInputError('Please enter your name(or email) and password to login');

                const user = await models.User.findByLogin(login);
                if (!user) {
                    throw new UserInputError('No user found with this login.');
                }

                const isValid = await user.validatePassword(password);

                if (!isValid) {
                    throw new AuthenticationError('Invalid password.');
                }

                return {
                    token: createToken(user, secret, '30m')
                }
            } catch (error) {
                return error;
            }

        },
        deleteUser: combineResolvers(
            isAuthenticated,
            isAdmin,
            async (parent, {
                id
            }, {
                models
            }) => {
                try {
                    if (!id) throw new UserInputError('No user chosen for deletion.Select one.');

                    const user = await models.User.findByPk(id);
                    if (!user) return new ApolloError('No user was found.');

                    return await models.User.destroy({
                        where: {
                            id: id
                        },
                    });
                } catch (error) {
                    return error;
                }

            }
        ),
        changeRole: combineResolvers(
            isAuthenticated,
            isAdmin,
            async (parent, {
                id,
                name,
                role
            }, {
                models
            }) => {
                try {
                    if (!id || !name) throw new UserInputError('Fields id and name must be filled');

                    const user = await models.User.findOne({
                        where: {
                            id: id,
                            name: name
                        }
                    });
                    if (!user) throw new ApolloError('No user was found.');

                    await models.User.update({
                        role: role
                    }, {
                        where: {
                            id: id,
                            name: name
                        }
                    });
                    return 'Done'
                } catch (error) {
                    return error;
                }

            },
        ),
    },
    User: {
        messages: async (user, args, {
            models
        }) => {
            return await models.Message.findAll({
                where: {
                    userId: user.id,
                },

            });
        },
        bugs: async (user, args, {
            models
        }) => {
            return await models.Bug.findAll({
                where: {
                    userId: user.id
                },
            });
        }
    },
};