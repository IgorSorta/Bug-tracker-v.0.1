const message = require("./message");

module.exports = {
    Query: {

        bugs: async (parent, args, {
            models
        }) => await models.Bug.findAll(),
        bug: async (parent, {
            id
        }, {
            models
        }) => await models.Bug.findByPk(id),

    },
    Mutation: {

        createBug: async (parent, {
            title,
            description
        }, {
            me,
            models
        }) => {
            return await models.Bug.create({
                title,
                description,
                userId: me.id,
            })
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
            return await models.Bug.findByPk(bug.userId);
        }
    },
};