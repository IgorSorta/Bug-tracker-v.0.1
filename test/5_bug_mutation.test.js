const {
    models
} = require('../src/models/index');
const createToken = require('../src/helpers/createToken');
const {
    getQuery
} = require('./helpers/test_Helpers');


var TEST_USER;
var token;
describe('Testing Bug mutations (createBug, changeStatus, setPriority, deleteBug):', () => {
    beforeAll(async () => {
        TEST_USER = await models.User.findOne({
            where: {
                name: 'testUser'
            }
        });

        token = await createToken(TEST_USER, process.env.SECRET, '30m');
    }, 10000);

    test('createBug: should pass if the mutation is valid', async () => {
        const result = await getQuery({
            query: `mutation {
            createBug(title:"Jest title", description: "This is bug from Jest") {
              title
              description
            }
              }
    `
        }, token);

        const result_data = {
            ...result.data.data.createBug
        };

        expect(result.status).toBe(200);
        expect(result.data.data).not.toBeNull();
        expect(result_data).toHaveProperty('title', 'Jest title');
        expect(result_data).toHaveProperty('description', 'This is bug from Jest');
    });

    test('changeStatus(id, status): should pass if the mutation is valid', async () => {
        const bug = await models.Bug.findOne({
            where: {
                description: "This is bug from Jest"
            }
        });

        const result = await getQuery({
            query: `mutation {
            changeStatus(id: "${bug.id}", status: TESTED)
          }
        `
        }, token);

        const result_data = {
            ...result.data.data
        };

        expect(result.status).toBe(200);
        expect(result.data.data).not.toBeNull();
        expect(result_data).toHaveProperty('changeStatus', 'Status changed.');
    });

    test('setPriority(id, priority): should pass if the mutation is valid', async () => {
        const bug = await models.Bug.findOne({
            where: {
                description: "This is bug from Jest"
            }
        });

        const result = await getQuery({
            query: `mutation {
            setPriority(id: "${bug.id}", priority: CRITICAL)
        }
      `
        }, token);

        const result_data = {
            ...result.data.data
        };

        expect(result.status).toBe(200);
        expect(result.data.data).not.toBeNull();
        expect(result_data).toHaveProperty('setPriority', 'DONE');
    });

    test('deleteBug(id): should pass if the mutation is valid', async () => {
        const bug = await models.Bug.findOne({
            where: {
                description: "This is bug from Jest"
            }
        });

        const result = await getQuery({
            query: `mutation {
          deleteBug(id: "${bug.id}")
            }
          `
        }, token);

        const result_data = {
            ...result.data.data
        };

        expect(result.status).toBe(200);
        expect(result.data.data).not.toBeNull();
        expect(result_data).toHaveProperty('deleteBug', true);
    });
});

describe('Testing Bug mutations for errors if input is invalid:', () => {

    const createBug_case = [
        ['', 'I have no title', "Bug message must contain title and description"],
        ['I have no description', '', "Bug message must contain title and description"]
    ];

    test.each(createBug_case)('createBug >> should fail if input (title: %s, description: %s) then result >>> %s', async (firstArg, secondArg, expectedResult) => {
        const error_result = await getQuery({
            query: `mutation {
          createBug(title:"${firstArg}", description: "${secondArg}") {
            title
            description
          }
            }
  `
        }, token);

        const message_data = {
            ...error_result.data
        };
        const error_data = {
            ...error_result.data.errors[0]
        };

        expect(message_data.data).toBeNull();
        expect(error_data).not.toBeNull();
        expect(error_data).toHaveProperty('message', expectedResult);
    });

    test('deleteBug(id): should fail if the mutation is invalid', async () => {
        const error_result = await getQuery({
            query: `mutation {
        deleteBug(id: "")
          }
        `
        }, token);

        const message_data = {
            ...error_result.data
        };
        const error_data = {
            ...error_result.data.errors[0]
        };

        expect(message_data.data).toBeNull();
        expect(error_data).not.toBeNull();
        expect(error_data).toHaveProperty('message', "Cannot read property 'userId' of null");
    });
});