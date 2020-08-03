const {
    models
} = require('../src/models/index');

const {
    getQuery
} = require('./helpers/test_Helpers')

describe('Testing Message query(messages, message(id)):', () => {
    var usxxx;
    var message;
    beforeAll(async () => {
        usxxx = await models.User.findOne({
            where: {
                name: 'testUser'
            }
        });

        message = await models.Message.findOne({
            where: {
                userId: usxxx.id
            }
        });
    }, 10000);

    test('messages should pass if the query is valid', async () => {
        const result = await getQuery({
            query: `query {
                messages {
                    text
                    user {
                      name
                    }
                  }
                }
      `
        });

        const expectedResult = {
            "data": {
                "messages": [{
                    "text": "test message",
                    "user": {
                        "name": "testUser",
                    }
                }]
            }
        };
        expect(result.data).not.toBeNull();
        expect(result.data).toBeDefined();
        expect(result.data).toMatchObject(expectedResult);
    });

    test('message(id) should pass if the query is valid', async () => {

        const result = await getQuery({
            query: `query {
                message(id: "${message.id}") {
                    text
                    user {
                      name
                    }
                  }
          }
      `
        });

        const expectedResult = {
            "data": {
                "message": {
                    "text": "test message",
                    "user": {
                        "name": "testUser"
                    }
                }
            }
        };

        expect(result.data).not.toBeNull();
        expect(result.data).toBeDefined();
        expect(result.data).toMatchObject(expectedResult);
    });
});

describe('Testing if Message query is invalid: ', () => {

    const messageId_case = [
        ['', 'User must provide message id'],
        ['d04bb000-cf43-4000-a00e-b8bc35645000', 'No message was found']
    ];

    test.each(messageId_case)('message(id) >> should fail if the query(id: %s) then result >>> %s', async (firstArg, expectedResult) => {

        const error_result = await getQuery({
            query: `query {
                message(id: "${firstArg}") {
                    text
                  }
          }
      `
        });
        const error_data = {
            ...error_result.data.errors[0]
        };

        expect(error_result.data.data).toBeNull();
        expect(error_data.message).toBe(expectedResult);
    });
});