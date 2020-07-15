module.exports = {
    Query: {
        me: (parent, args, {
            me
        }) => {
            return me;
        },
        user: (parent, {
            id
        }, {
            models
        }) => {
            return models.users[id];
        },
        users: (parent, args, {
            models
        }) => {
            return Object.values(models.users);
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
}