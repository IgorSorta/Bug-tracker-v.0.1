'use strict';

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
        // *Get current logged in user
        me: async (parent, args, {
            me,
            models
        }) => {
            try {
                // If token is not valid
                if (!me) throw new ForbiddenError('You are not authenticated. Please login.');

                const user = await models.User.findByPk(me.id);
                if (!user) throw new ApolloError('No user was found.');

                return user;
            } catch (error) {
                return error;
            }

        },
        // *Get user where id is (uuidv4)
        user: async (parent, {
            id
        }, {
            models
        }) => {
            try {
                // Check id is exist
                if (!id) throw new UserInputError('User must provide id');

                const user = await models.User.findByPk(id);
                if (!user) throw new ApolloError('No user was found.');

                return user;
            } catch (error) {
                return error;
            }

        },
        // *Get all users from DB
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
        // *Register user and return token
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
        // *Login user (and return token)
        signIn: async (parent, {
            login: login,
            password: password
        }, {
            models,
            secret
        }) => {
            try {
                if (!login || !password) throw new UserInputError('Please enter your name(or email) and password to login');

                const user = await models.User.findByLogin(login); // find user in DB
                if (!user) {
                    throw new UserInputError('No user found with this login.');
                }

                const isValid = await user.validatePassword(password); // check password

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
        // *Delete user with id(uuidv4)
        deleteUser: combineResolvers( // helps compose middleware
            isAuthenticated, // check if user is logged in
            isAdmin, // check if user is in Admin role
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
        // *Chage user role(USER, ADMIN)
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
    // If user requested with nested queries
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