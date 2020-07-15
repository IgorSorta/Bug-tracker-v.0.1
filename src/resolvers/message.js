module.exports = {
    Query: {
        messages: (parent, args, {
            models
        }) => Object.values(models.main),
        message: (parent, {
            id
        }, {
            models
        }) => models.main[id],
    },
    Mutation: {
        createMessage: (parent, {
            text
        }, {
            me,
            models
        }) => {
            const id = Math.floor(Math.random() * 100);

            const message = {
                id,
                userId: me.id,
                text
            };

            models.main[id] = message;
            models.users[me.id].messageIds.push(id);

            return message;
        },
        deleteMessage: (parent, {
            id
        }, {
            models
        }) => {
            const {
                [id]: message, ...otherMessages
            } = models.main;

            if (!message) {
                return false;
            }

            models.main = otherMessages;

            return true;
        },
    },
    Message: {
        user: (message, args, {
            models
        }) => {
            return models.users[message.userId];
        }
    },
};