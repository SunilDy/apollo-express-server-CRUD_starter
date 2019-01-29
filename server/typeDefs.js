const { gql } = require("apollo-server-express")

const typeDefs = gql`
    type User {
        name: String
        email: String
        password: String
        id: ID
    }
    type Query {
        findUser(name: String!, password: String!): User
        users: [User]
    }
    type Mutation {
        createUser(name: String!,email: String,password: String!): User
        deleteUser(name: String!, password: String!) : User!
        updateUser(name: String!, password: String!, updateName: String!): User!
    }
    type Subscription {
        newUser: User!
        userDeleted: User!
        userUpdated: User!
    }
`

module.exports = typeDefs