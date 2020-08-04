const createUUID = require('../src/helpers/createUUID');
module.exports = async (models, date) => {
    await models.User.create({
        id: createUUID(),
        name: 'testUser',
        email: 'test@mail.com',
        role: 'ADMIN',
        password: 'testtesttest',
        createdAt: date.setSeconds(date.getSeconds() + 1),
    }, {
        includes: [models.Message, models.Bug]
    }).then((user) => {
        models.Message.create({
            text: 'test message',
            createdAt: date.setSeconds(date.getSeconds() + 1),
            userId: user.id,
        });

        models.Bug.create({
            title: 'test title',
            description: 'test bug',
            createdAt: date.setSeconds(date.getSeconds() + 1),
            userId: user.id,
        })
    });
}