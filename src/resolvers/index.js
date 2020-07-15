let {
    main,
    bugs,
    users
} = require("../models");

module.exports = {
    Query: {
        messages: () => Object.values(main),
        message: (parent, {
            id
        }) => main[id],
        bugs: () => Object.values(bugs),
        bug: (parent, {
            id
        }) => bugs[id],
        users: () => Object.values(users),
        user: (parent, {
            id
        }) => users[id],

    },
    Mutation: {
        createMessage: (parent, {
            text
        }, {
            me
        }) => {
            const id = Math.floor(Math.random() * 100);

            const message = {
                id,
                userId: me.id,
                text
            };

            main[id] = message;
            users[me.id].messageIds.push(id);

            return message;
        },
        createBug: (parent, {
            title,
            description
        }, {
            me
        }) => {
            const id = Math.floor(Math.random() * 1001);

            const bug = {
                id,
                userId: me.id,
                title,
                description
            };

            bugs[id] = bug;
            users[me.id].bugIds.push(id);

            return bug;
        },
        deleteMessage: (parent, {
            id
        }) => {
            const {
                [id]: message, ...otherMessages
            } = main;

            if (!message) {
                return false;
            }

            main = otherMessages;

            return true;
        },
        deleteBug: (parent, {
            id
        }) => {
            const {
                [id]: bug, ...otherBugs
            } = bugs;

            if (!bug) {
                return false;
            }

            bugs = otherBugs;
            return true;
        },
    },
    Message: {
        user: (message) => {
            return users[message.userId];
        }
    },
    Bug: {
        user: (bug) => {
            return users[bug.userId];
        }
    },
    User: {
        messages: (user) => {
            return Object.values(main).filter(message => message.userId === user.id);
        },
        bugs: (user) => {
            return Object.values(bugs).filter(bug => bug.userId === user.id);
        }
    }
};