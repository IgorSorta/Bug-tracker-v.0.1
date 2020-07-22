const createToken = require('../helpers/createToken');

module.exports = {
    Query: {
        me: async (parent, args, {
            me,
            models
        }) => {
            if (!me) {
                return null;
            }

            return await models.User.findByPk(me.id);
        },
        user: async (parent, {
            id
        }, {
            models
        }) => {
            return await models.User.findByPk(id);
        },
        users: async (parent, args, {
            models
        }) => {
            return await models.User.findAll();
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
            const user = models.User.create({
                id: 22,
                name: name,
                email: email,
                password: password
            });
            return {
                token: createToken(user, secret, '30m')
            };
        }
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