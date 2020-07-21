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
        createMessage: async (parent, {
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
        },
        deleteMessage: async (parent, {
            id
        }, {
            models
        }) => {
            return await models.Message.destroy({
                where: {
                    id: id
                }
            });
        },
    },
    Message: {
        user: async (message, args, {
            models
        }) => {
            return await models.User.findByPk(message.userId);
        }
    },
};