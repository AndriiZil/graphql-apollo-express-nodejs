const { gql } = require('apollo-server-express');

const typeDefs = gql`
    extend type Query {
        users: [User!]
        user(id: ID!): User!
    }
    
    type User {
        id: ID!
        name: String!
        email: String!
        tasks: [Task!]
    }
`;

module.exports = typeDefs;
