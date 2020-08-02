const {
    models
} = require('../src/models/index');
const createToken = require('../src/helpers/createToken');
const {
    getQuery
} = require('./helpers/test_Helpers');

var TEST_USER;
var token;
describe('Testing User: query (users, user(id), me)', () => {
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

        const query_data = {
            ...test_query.data.data
        };

        expect(test_query).not.toBeNull();
        expect(test_query.status).toBe(200);
        expect(test_query.data).toBeDefined();
        expect(query_data.users[0]).toHaveProperty('name', 'testUser');
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

        expect(test_query).not.toBeNull();
        expect(test_query.status).toBe(200);
        expect(test_query.data).toBeDefined();
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

        expect(test_query).not.toBeNull();
        expect(test_query.status).toBe(200);
        expect(test_query.data).toBeDefined();
        expect(test_query.data).toMatchObject(expectedResult);
    });
});

describe('Testing User if query is invalid:', () => {
    const userId_case = [
        ['', 'User must provide id'],
        ['d04bb000-cf43-4000-a00e-b8bc35645000', 'No user was found.']
    ];

    test.each(userId_case)('user(id) >> should fail if the query (id: %s) then result >>> %s', async (firstArg, expectedResult) => {

        const error_query = await getQuery({
            query: `query {
            user(id: "${firstArg}") {
              name
            }
          }
      `
        });

        const error_data = {
            ...error_query.data
        };
        const error_data_2 = {
            ...error_query.data.errors[0]
        };

        expect(error_data.data.user).toBeNull();
        expect(error_data_2).toHaveProperty('message', expectedResult);
    });

    test('me: should fail if token not provided', async () => {

        const error_query = await getQuery({
            query: `query {
                me {
                    
                    name
                  }
            }`
        });

        const error_data = {
            ...error_query.data
        };
        const error_data_2 = {
            ...error_query.data.errors[0]
        };

        expect(error_data.data.me).toBeNull()
        expect(error_data_2).toHaveProperty('message', 'You are not authenticated. Please login.');
    });
});