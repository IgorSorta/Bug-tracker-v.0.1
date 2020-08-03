const {
    models
} = require('../src/models/index');
const createToken = require('../src/helpers/createToken');
const {
    getQuery
} = require('./helpers/test_Helpers');

var TEST_USER;
var token;
describe('Testing Message mutations (createMessage, deleteMessage(id)):', () => {

    beforeAll(async () => {
        TEST_USER = await models.User.findOne({
            where: {
                name: 'testUser'
            }
        });

        token = await createToken(TEST_USER, process.env.SECRET, '30m');

    }, 10000);

    test('createMessage: should pass if mutation is valid', async () => {
        const result = await getQuery({
            query: `mutation {
          createMessage(text: "Test message from Jest") {
              text
            }
          }
      `
        }, token);
        const message_data = {
            ...result.data.data
        };

        expect(result.status).toBe(200);
        expect(result.data).not.toBeNull();
        expect(result.data.data).toBeDefined();
        expect(message_data.createMessage).toHaveProperty('text', 'Test message from Jest');
    });

    test('deleteMessage(id): should pass if mutation is valid', async () => {
        const message = await models.Message.findOne({
            where: {
                text: 'Test message from Jest'
            }
        });

        const result = await getQuery({
            query: `mutation {
        deleteMessage(id: "${message.id}") 
        }
    `
        }, token);

        expect(result.status).toBe(200);
        expect(result.data).not.toBeNull();
        expect(result.data.data).toBeDefined();
        expect(result.data.data).toHaveProperty('deleteMessage', true);
    });
});

describe('Testing Message mutations for error:', () => {

    test('createMessage: should fail if input is invalid', async () => {
        const error_result = await getQuery({
            query: `mutation {
        createMessage(text: "") {
            text
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
        expect(error_data).toHaveProperty('message', 'Input text to create message');
    });

    const messageId_case = [
        ['', "Cannot read property 'userId' of null"],
        ['d04bb000-cf43-4000-a00e-b8bc35645000', "Cannot read property 'userId' of null"]
    ];

    test.each(messageId_case)('deleteMessage(id) >> should fail if input (id: %s) then result >>> %s', async (firstArg, expectedResult) => {

        const error_result = await getQuery({
            query: `mutation {
        deleteMessage(id: "${firstArg}") 
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
});