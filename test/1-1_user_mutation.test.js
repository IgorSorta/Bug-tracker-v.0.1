const {
    models
} = require('../src/models/index');
const createToken = require('../src/helpers/createToken');
const {
    getQuery
} = require('./helpers/test_Helpers');

describe('Testing User: mutation (signUp, signIn, changeRole, deleteUser)', () => {
    var TEST_USER;
    var token;
    beforeAll(async () => {
        TEST_USER = await models.User.findOne({
            where: {
                name: 'testUser'
            }
        });

        token = await createToken(TEST_USER, process.env.SECRET, '30m')
    }, 10000);

    test('signUp: should pass if the mutation is valid', async () => {
        const test_mutation = await getQuery({
            query: `mutation {
                signUp(name: "max", email: "max@mail.com", password: "maxmaxmax") {
                  token
                }
              }
        `
        }, token);
        console.log(test_mutation.data)

        // const expectedResult = {
        //     "data": {
        //         "signUp": {
        //             "token": ""
        //         }
        //     }
        // };

        expect(test_mutation.status).toBe(200);
        expect(test_mutation.data).toHaveProperty("data.signUp.token")
    });

    test.todo('signIn');

    test.todo('deleteUser');

});