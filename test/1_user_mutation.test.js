const {
    models
} = require('../src/models/index');
const createToken = require('../src/helpers/createToken');
const {
    getQuery
} = require('./helpers/test_Helpers');



var TEST_USER;
var token;
describe('Testing User mutations (signUp, signIn, changeRole, deleteUser):', () => {
    beforeAll(async () => {
        TEST_USER = await models.User.findOne({
            where: {
                name: 'testUser'
            }
        });

        token = await createToken(TEST_USER, process.env.SECRET, '30m');
    }, 10000);


    test('signUp: should pass if the mutation is valid', async () => {
        const test_mutation = await getQuery({
            query: `mutation {
                    signUp(name: "John", email: "john@mail.com", password: "123456789") {
                      token
                    }
                  }
            `
        });

        expect(test_mutation).not.toBeNull();
        expect(test_mutation.status).toBe(200);
        expect(test_mutation.data).toHaveProperty("data.signUp.token");
    });

    test('signIn: should pass if the mutation is valid', async () => {
        const test_mutation_2 = await getQuery({
            query: `mutation {
                        signIn(login:"testUser", password: "testtesttest") {
                            token
                          }
                      }
                `
        });

        expect(test_mutation_2).not.toBeNull();
        expect(test_mutation_2.status).toBe(200);
        expect(test_mutation_2.data).toHaveProperty("data.signIn.token");
    });

    test('changeRole: should pass if the mutation is valid', async () => {
        const user = await models.User.findOne({
            where: {
                name: 'John'
            }
        });

        const test_mutation_3 = await getQuery({
            query: `
                mutation {
                    changeRole(id:"${user.id}", name:"${user.name}", role: ADMIN)
                }
            `
        }, token);

        expect(test_mutation_3).not.toBeNull();
        expect(test_mutation_3.status).toBe(200);
        expect(test_mutation_3.data).toHaveProperty('data.changeRole', 'Done');
    });

    test('deleteUser: should pass if the mutation is valid', async () => {
        const user = await models.User.findOne({
            where: {
                name: 'John'
            }
        });

        const test_mutation_4 = await getQuery({
            query: `
                    mutation {
                        deleteUser(id: "${user.id}")
                    }
                `
        }, token);

        expect(test_mutation_4).not.toBeNull();
        expect(test_mutation_4.status).toBe(200);
        expect(test_mutation_4.data).toHaveProperty('data.deleteUser', true)

    });
});

describe('Testing mutations for errors:', () => {
    const signUp_case = [
        ['', 'john@mail.com', '123456789', 'User must provide name'],
        ['John', '', '123456789', 'User must provide email'],
        ['John', 'john@mail.com', '', 'User must provide password']
    ];

    test.each(signUp_case)('signUp >> should fail if input(name: %s, email: %s, password: %s) then result >>> %s', async (firstArg, secondArg, thirdArg, expectedResult) => {
        const error_mutation = await getQuery({
            query: `mutation {
                    signUp(name: "${firstArg}", email: "${secondArg}", password: "${thirdArg}") {
                      token
                    }
                  }
            `
        });

        const error_data = {
            ...error_mutation.data.errors[0]
        };

        expect(error_mutation.data.data).toBeNull();
        expect(error_data.message).toContain(expectedResult)
    });

    const signIn_case = [
        ['testUser', '', 'Please enter your name(or email) and password to login'],
        ['', 'testtesttest', 'Please enter your name(or email) and password to login'],
        ['wrong_user', 'testtesttest', 'No user found with this login.'],
        ['testUser', 'wrong_password', 'Invalid password.']
    ];

    test.each(signIn_case)('signIn >> should fail if the input(name: %s, password: %s) then result >>> %s', async (firstArg, secondArg, expectedResult) => {
        const error_mutation = await getQuery({
            query: `mutation {
                        signIn(login: "${firstArg}", password: "${secondArg}") {
                            token
                          }
                      }
                `
        });

        const error_data = {
            ...error_mutation.data.errors[0]
        };

        expect(error_mutation.data.data).toBeNull();
        expect(error_data.message).toContain(expectedResult)
    });

    const deleteUser_case = [
        ['', 'No user chosen for deletion.Select one.'],
        ['d04bb000-cf43-4000-a00e-b8bc35645000', 'No user was found.'],

    ];

    test.each(deleteUser_case)('deleteUser >> should fail if input (id: %s) then result >>> %s', async (firstArg, expectedResult) => {
        const error_mutation = await getQuery({
            query: `
                    mutation {
                        deleteUser(id: "${firstArg}")
                    }
                `
        }, token);

        const error_data = {
            ...error_mutation.data.errors[0]
        };

        expect(error_mutation.data.data).toBeNull();
        expect(error_data.message).toContain(expectedResult)
    });
});