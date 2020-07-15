module.exports = {
    Query: {

        bugs: (parent, args, {
            models
        }) => Object.values(models.bugs),
        bug: (parent, {
            id
        }, {
            models
        }) => models.bugs[id],

    },
    Mutation: {

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

        deleteBug: (parent, {
            id
        }, {
            models
        }) => {
            const {
                [id]: bug, ...otherBugs
            } = models.bugs;

            if (!bug) {
                return false;
            }

            models.bugs = otherBugs;
            return true;
        },
    },

    Bug: {
        user: (bug, args, {
            models
        }) => {
            return models.users[bug.userId];
        }
    },
};