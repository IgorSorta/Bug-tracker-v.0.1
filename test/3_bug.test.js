const axios = require('axios');
const {
    models
} = require('../src/models/index');

const API_URL = 'http://localhost:4000/bug';
const getQuery = async (query) => axios.post(API_URL,
    query
);

describe('Testing Bug: query', () => {
    var usxxx;
    var bug;
    beforeAll(async () => {
        usxxx = await models.User.findOne({
            where: {
                name: 'testUser'
            }
        });

        bug = await models.Bug.findOne({
            where: {
                userId: usxxx.id
            }
        });
    }, 10000);

    test('Should pass if the query is valid: bugs', async () => {
        const query = await getQuery({
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
                    "description": "test bug ",
                    "user": {
                        "name": "testUser",
                    }
                }]
            }
        };

        expect(query.data).toMatchObject(expectedResult);
    });

    // test('Should pass if the query is valid: message(id)', async () => {

    //     const result = await getQuery({
    //         query: `query {
    //             message(id: "${message.id}") {
    //                 text
    //                 user {
    //                   name
    //                 }
    //               }
    //       }
    //   `
    //     });

    //     const expectedResult = {
    //         "data": {
    //             "message": {
    //                 "text": "test message",
    //                 "user": {
    //                     "name": "testUser"
    //                 }
    //             }
    //         }
    //     };

    //     expect(result.data).toMatchObject(expectedResult);
    // });
});