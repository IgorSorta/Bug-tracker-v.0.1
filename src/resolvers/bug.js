const {
    includes
} = require(".");

module.exports = {
    Query: {

        bugs: async (parent, args, {
            models
        }) => {
            return await models.Bug.findAll()
        },
        bug: async (parent, {
            id
        }, {
            models
        }) => {
            return await models.Bug.findByPk(id)
        },

    },
    Mutation: {
        createBug: async (parent, {
            title,
            description
        }, {
            me,
            models
        }) => {
            try {
                const newBug = await models.Bug.create({
                    title,
                    description,
                    userId: me.id,
                }, );
                return newBug;
            } catch (error) {
                throw new Error(error);
            }
        },

        deleteBug: async (parent, {
            id
        }, {
            models
        }) => {
            return await models.Bug.destroy({
                where: {
                    id
                }
            });
        },
    },

    Bug: {
        user: async (bug, args, {
            models
        }) => {
            return await models.User.findByPk(bug.userId);
        }
    },
};