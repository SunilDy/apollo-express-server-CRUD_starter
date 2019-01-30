const { gql } = require("apollo-server-express")

const typeDefs = gql`
    type Joke {
        id: ID!
        data: String!
    }
    type UserDetails {
        nickname: String
        jokes: [Joke]
    }
    type User {
        id: ID!
        name: String!
        email: String!
        password: String!
        details: UserDetails
    }
    type Query {
        findUser(name: String!, password: String!): User
        users: [User]
        jokes: [Joke]
        findJoke(id: ID!): Joke
    }
    type Mutation {
        createUser(name: String!,email: String,password: String!): User
        deleteUser(name: String!, password: String!) : User!
        # updateUser(name: String!, password: String!, updateName: String!): User!
        updateUser(id: ID!, name: String!): User!
        addUserDetails(name: String!, password: String!, nickname: String!): User!
        addJoke(name: String!, password: String!,joke: String!): Joke!
    }
    type Subscription {
        newUser: User!
        userDeleted: User!
        userUpdated: String!
    }
`

module.exports = typeDefs