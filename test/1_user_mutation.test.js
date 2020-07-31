const {
    models
} = require('../src/models/index');
const createToken = require('../src/helpers/createToken');
const {
    getQuery
} = require('./helpers/test_Helpers');




describe('Testing User mutations (signUp, signIn, changeRole, deleteUser):', () => {
    var TEST_USER;
    var token;
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
        console.log(test_mutation_3.data);
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