const { gql } = require('apollo-server-express');

const typeDefs = gql`
    extend type Query {
        users: [User!]
        user: User!
    }

    extend type Mutation {
        signup(input: signInput): User
        login(input: loginInput): Token
    }

    input loginInput {
        email: String!
        password: String!
    }

    type Token {
        token: String!
    }

    input signInput {
        name: String!
        email: String!
        password: String!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        tasks: [Task!]
        createdAt: Date!
        updatedAt: Date!
    }
`;

module.exports = typeDefs;
