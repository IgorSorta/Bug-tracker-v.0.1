const createToken = require('../src/helpers/createToken');
const {
    models
} = require('../src/models/index');
const JWT = require('jsonwebtoken');


describe('Testing src/helpers functions (createToken):', () => {
    let TEST_USER;
    beforeAll(async () => {
        TEST_USER = await models.User.findOne({
            where: {
                name: 'testUser'
            }
        });

    }, 10000);

    test('createToken: should pass if token is valid', async () => {
        const test_token = await createToken(TEST_USER, process.env.SECRET, '30m');

        const result = await JWT.verify(test_token, process.env.SECRET);

        expect(result).toBeDefined();
        expect(result).not.toBeNull();
        expect(result.id).toBe(TEST_USER.id);
        expect(result.email).toBe(TEST_USER.email);
        expect(result.name).toBe(TEST_USER.name);
    });
});