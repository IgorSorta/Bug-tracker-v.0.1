const {
    gql
} = require('apollo-server-express');

const main = gql `
  type Query {
    messages: [Message!]
    message(id: ID!): Message
    bugs: [Bug!]
    bug(id: ID!): Bug
    users: [User!]
    user(id: ID!): User
  }

  type Mutation {
    createMessage(text: String!): Message!
    deleteMessage(id: ID!): Boolean!
    createBug(title: String! description: String!): Bug!
    deleteBug(id: ID!): Boolean!
  }

  type Message {
    id: ID!
    user: User!
    text: String!
  }

  type Bug {
    id: ID!
    user: User!
    title: String!
    description: String!
  }

  type User {
    id: ID!
    name: String!
    messages: [Message!]
    bugs: [Bug!]
  }

  type Admin {
    id: ID!
    name: String!
    messages: [Message!]
    bugs: [Bug!]
  }
`;

module.exports = main;