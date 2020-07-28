const axios = require('axios');
const {
    models
} = require('../src/models/index');

const API_URL = 'http://localhost:4000/bug';
const getQuery = async (query) => axios.post(API_URL,
    query
);

describe('Testing Message: query', () => {
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

    test('Should pass if the query is valid: messages', async () => {
        const query = await getQuery({
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

        expect(query.data).toMatchObject(expectedResult);
    });

    test('Should pass if the query is valid: message(id)', async () => {

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

        expect(result.data).toMatchObject(expectedResult);
    });
});