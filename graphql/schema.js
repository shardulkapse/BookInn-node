const { buildSchema } = require("graphql");

module.exports = buildSchema(`

type userLoginData {
    _id: ID!
    email: String!
    password:String!
    name: String!
}

input loginUserInput {
    email: String!
    password: String
}

type listData {
    _id: ID!
    name: String
    images: String
    address: String
    ratings: String
    price: String 
}

type RootQuery {
    loginUser(userInput: loginUserInput!): userLoginData
    getList(page: Int!): [listData!]
    searchList(query: String! page: Int!): [listData!]
}

input signInUserInput {
    email: String!
    password: String!
    name: String!
}

type RootMutation {
    signInUser(userInput: signInUserInput!): userLoginData!
}

schema {
     query: RootQuery
     mutation: RootMutation
}
   
`);
