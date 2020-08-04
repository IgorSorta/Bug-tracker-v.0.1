const {
    models
} = require('../src/models/index');

const {
    getQuery
} = require('./helpers/test_Helpers');

var TEST_USER;
var bug;
describe('Testing Bug query (bugs, bug(id)):', () => {
    beforeAll(async () => {
        TEST_USER = await models.User.findOne({
            where: {
                name: 'testUser'
            }
        });

        bug = await models.Bug.findOne({
            where: {
                userId: TEST_USER.id,
                description: 'test bug'
            }
        });
    }, 10000);

    test('bugs should pass if the query is valid', async () => {
        const result = await getQuery({
            query: `query {
              bugs {
                title
                description
                user {
                  name
                }
              }
                }
      `
        });

        const expectedResult = {
            "data": {
                "bugs": [{
                    "title": "test title",
                    "description": "test bug",
                    "user": {
                        "name": "testUser",
                    }
                }]
            }
        };

        expect(result.status).toBe(200);
        expect(result.data).not.toBeNull();
        expect(result.data).toBeDefined();
        expect(result.data).toMatchObject(expectedResult);
    });


    test('bug(id) should pass if the query is valid', async () => {
        const result = await getQuery({
            query: `query {
              bug(id: "${bug.id}") {
                title
                description
              }
                }
            `
        });

        const expectedResult = {
            "data": {
                "bug": {
                    "title": "test title",
                    "description": "test bug"
                }
            }
        };

        expect(result.status).toBe(200);
        expect(result.data).not.toBeNull();
        expect(result.data).toBeDefined();
        expect(result.data).toMatchObject(expectedResult);
    });

});

describe('Testing Bug query for errors if input is invalid:', () => {
    const bugId_case = [
        ['', 'User must provide bug id'],
        ['d04bb000-cf43-4000-a00e-b8bc35645000', 'No bug was found']
    ];

    test.each(bugId_case)('bug(id) >> should fail if the input (id: %s) then result >>> %s', async (firstArg, expectedResult) => {
        const error_result = await getQuery({
            query: `query {
              bug(id: "${firstArg}") {
                title
                description
              }
                }
            `
        });

        const error_data = {
            ...error_result.data.errors[0]
        };

        expect(error_result.data.data.bug).toBeNull();
        expect(error_data.message).toBe(expectedResult);
    });

});