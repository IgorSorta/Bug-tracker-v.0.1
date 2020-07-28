//const EasyGraphQLTester = require("easygraphql-tester");
const axios = require('axios');
const {
    models
} = require('../src/models/index');

const API_URL = 'http://localhost:4000/bug';
const getQuery = async (query) => axios.post(API_URL,
    query
);

describe('Testing User: query', () => {
    var usxxx;
    beforeAll(async () => {
        usxxx = await models.User.findOne({
            where: {
                name: 'testUser'
            }
        });
    }, 10000);

    test('Should pass if the query is valid: users', async () => {
        const result = await getQuery({
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

        expect(result.data).toMatchObject(expectedResult);
    });

    test('Should pass if the query is valid: user(id)', async () => {

        const result = await getQuery({
            query: `query {
            user(id: "${usxxx.id}") {
              name
            }
          }
      `
        });

        const expectedResult = {
            data: {
                user: {
                    name: usxxx.name,

                },
            },
        };

        expect(result.data).toMatchObject(expectedResult);
    });
});