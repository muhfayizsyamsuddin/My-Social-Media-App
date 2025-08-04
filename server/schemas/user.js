const { database } = require("../config/mongodb");

const users = [
  {
    name: "user",
    username: "user",
    email: "user@mail.com",
    password: "password123",
  },
];

const typeDefs = `#graphql
  type User {
    name: String
    username: String
    email: String
    password: String
  }
  type Query {
    getUsers: [User]
  }
  input UserInput {
    name: String
    username: String
    email: String
    password: String
  }
  type Mutation {
    addUser(newUser: UserInput): User
  }
`;

const resolvers = {
  Query: {
    getUsers: () => {
      return users;
    },
  },
  Mutation: {
    addUser: async (_, { newUser }) => {
      const { name, username, email, password } = newUser;
      const user = {
        name,
        username,
        email,
        password,
      };
      await database.collection("users").insertOne(user);
      return user;
    },
  },
};

module.exports = { userTypeDefs: typeDefs, userResolvers: resolvers };
