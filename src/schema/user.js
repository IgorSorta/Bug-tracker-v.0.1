const {
    gql
} = require('apollo-server-express');

const user = gql `
extend type Query {
  users: [User!]
  user(id: ID!): User
  me: User
}

extend type Mutation {
  signUp(name: String! email: String! password: String!): Token!
  signIn(login: String!, password: String!): Token!
}

type User {
  id: ID!
  name: String!
  email: String!
  messages: [Message!]
  bugs: [Bug!]
}

type Token {
  token: String!
}
`;

module.exports = user;