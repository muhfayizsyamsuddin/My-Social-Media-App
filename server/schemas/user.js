const UserModel = require("../models/UserModel");

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
  input RegisterUserInput {
    name: String
    username: String
    email: String
    password: String
  }
  input LoginUserInput {
    username: String
    password: String
  }
  type Mutation {
    register(newUser: RegisterUserInput): User
    login(userLogin: LoginUserInput): String
  }
`;

const resolvers = {
  Query: {
    getUsers: () => {
      return users;
    },
  },
  Mutation: {
    register: async (_, { newUser }) => {
      const { name, username, email, password } = newUser;
      const user = {
        name,
        username,
        email,
        password,
      };
      await UserModel.register(user);
      return user;
    },
    login: async (_, { userLogin }) => {
      const { username, password } = userLogin;
      const user = {
        username,
        password,
      };
      const access_token = await UserModel.login(user);
      return access_token;
    },
  },
};

module.exports = { userTypeDefs: typeDefs, userResolvers: resolvers };
