let {
    main,
    bugs,
    users
} = require("../models");

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
        bugs: (parent, args, {
            models
        }) => Object.values(models.bugs),
        bug: (parent, {
            id
        }, {
            models
        }) => models.bugs[id],
        users: (parent, args, {
            models
        }) => Object.values(models.users),
        user: (parent, {
            id
        }, {
            models
        }) => models.users[id],

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
        createBug: (parent, {
            title,
            description
        }, {
            me,
            models
        }) => {
            const id = Math.floor(Math.random() * 1001);

            const bug = {
                id,
                userId: me.id,
                title,
                description
            };

            models.bugs[id] = bug;
            models.users[me.id].bugIds.push(id);

            return bug;
        },
        deleteMessage: (parent, {
            id
        }, {
            models
        }) => {
            const {
                [id]: message, ...otherMessages
            } = main;

            if (!message) {
                return false;
            }

            models.main = otherMessages;

            return true;
        },
        deleteBug: (parent, {
            id
        }, {
            models
        }) => {
            const {
                [id]: bug, ...otherBugs
            } = bugs;

            if (!bug) {
                return false;
            }

            models.bugs = otherBugs;
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
    Bug: {
        user: (bug, args, {
            models
        }) => {
            return models.users[bug.userId];
        }
    },
    User: {
        messages: (user, args, {
            models
        }) => {
            return Object.values(models.main).filter(message => message.userId === user.id);
        },
        bugs: (user, args, {
            models
        }) => {
            return Object.values(models.bugs).filter(bug => bug.userId === user.id);
        }
    }
};