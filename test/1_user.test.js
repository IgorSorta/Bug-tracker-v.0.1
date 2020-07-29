const {
    models
} = require('../src/models/index');
const createToken = require('../src/helpers/createToken');
const {
    getQuery
} = require('./helpers/test_Helpers');

describe('Testing User: query (users, user(id), me)', () => {
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

    test('users: should pass if the query is valid', async () => {
        const test_query = await getQuery({
            query: `query {
            users {
              name
            }
          }
      `
        });

        const expectedResult = {
            data: {
                users: [{
                    name: 'testUser',

                }, ]
            },
        };

        expect(test_query.data).toMatchObject(expectedResult);
    });

    test('user(id): should pass if the query is valid', async () => {

        const test_query = await getQuery({
            query: `query {
            user(id: "${TEST_USER.id}") {
              name
            }
          }
      `
        });

        const expectedResult = {
            data: {
                user: {
                    name: TEST_USER.name,

                },
            },
        };

        expect(test_query.data).toMatchObject(expectedResult);
    });

    test('me: should pass if the query is valid', async () => {
        const test_query = await getQuery({
            query: `query {
                me {
                    id
                    name
                  }
            }`
        }, token);

        const expectedResult = {
            "data": {
                "me": {
                    "name": TEST_USER.name
                }
            }
        };

        expect(test_query.data).toMatchObject(expectedResult)
    })
});