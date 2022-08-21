const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Auth {
        token: ID!
        user: User
    }
    type User {
        _id: ID
        username: String
        email: String
        savedBooks: [bookSchema]
    }
    type bookSchema {
        authors: [String]
        description: String
        bookId: String
        image: String
        link: String
        title: String!
    }
    type Query {
        me: User
        users: [User]
        user(username: String!): User
        books: [bookSchema]
        book(bookId: String!): bookSchema
    }
    

    type Mutation {
        addUser(username: String!, email: String!, password: String!): Auth
        login(email: String!, password: String!): Auth
        saveBook(authors: [String], description: String!, bookId: String!, image: String, link: String, title: String!): bookSchema
        removeBook(bookId: String!): bookSchema
        
    }
    `;
    
module.exports = typeDefs;