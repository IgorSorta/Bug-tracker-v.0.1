const {
    gql
} = require('apollo-server-express');

const user = gql `
extend type Query {
  users: [User!]
  user(id: ID!): User
  me: User
}

type User {
  id: ID!
  name: String!
  messages: [Message!]
  bugs: [Bug!]
}
`;

module.exports = user;