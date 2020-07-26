const {
    gql
} = require('apollo-server-express');

const bug = gql `
extend type Query {
  bugs: [Bug!]
  bug(id: ID!): Bug
}

extend type Mutation {
  createBug(title: String! description: String!): Bug!
  deleteBug(id: ID!): Boolean!
  changeStatus(id: ID! status: bugStatus!): String!
  setPriority(id: ID! priority:bugPriority!): String!
}

type Bug {
  id: ID!
  user: User!
  title: String!
  description: String!
  status: String!
  priority: String!
  createdAt: Date!
}

enum bugStatus {
  NEW
  CONFIRMED
  DEVELOPED
  IN TESTING
  TESTED
  CLOSED
  REJECTED
}

enum bugPriority {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}
`;

module.exports = bug;