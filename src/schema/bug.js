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
}

type Bug {
  id: ID!
  user: User!
  title: String!
  description: String!
  createdAt: Date!
}
`;

module.exports = bug;