const UserModel = require("../models/UserModel");
const { hashPassword, comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");

const typeDefs = `#graphql
  type User {
    _id: ID
    name: String
    username: String
    email: String
    followers: [User]
    followings: [User]
  }
  # type Follow {
  #   followerId: ID
  #   followingId: ID
  #   createdAt: String
  #   updatedAt: String
  # }
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
  type LoginResponse {
    access_token: String
    message: String
  }
  # input FollowInput {
  #   followerId: ID
  #   followingId: ID
  # }
  type Query {
    getUsers: [User]
    getUserById(id: ID!): User
    getUserByUsername(username: String!): User
    searchUsers(keyword: String!): [User]
  }
  type Mutation {
    register(newUser: RegisterUserInput): User
    login(userLogin: LoginUserInput): LoginResponse
  }
`;

const resolvers = {
  Query: {
    getUsers: async (_, __, { auth }) => {
      await auth();
      const users = await UserModel.getAllUsers();
      return users;
    },
    getUserById: async (_, { id }, { auth }) => {
      await auth();
      const user = await UserModel.getUserById(id);
      return user;
    },
    getUserByUsername: async (_, { username }, { auth }) => {
      await auth();
      const user = await UserModel.getUserByUsername(username);
      return user;
    },
    searchUsers: async (_, { keyword }, { auth }) => {
      await auth();
      if (!keyword) {
        throw new Error("Keyword is required for search");
      }
      const users = await UserModel.searchUsers(keyword);
      return users;
    },
  },
  Mutation: {
    register: async (_, { newUser }) => {
      const { name, username, email, password } = newUser;
      const result = await UserModel.register({
        name,
        username,
        email,
        password,
      });
      return result;
    },
    login: async (_, { userLogin }) => {
      const { username, password } = userLogin;
      if (!username) {
        throw new Error("Username is required");
      }
      if (!password) {
        throw new Error("Password is required");
      }
      const user = await UserModel.login({
        username,
      });
      if (!user) {
        throw new Error("Username not found");
      }
      // if (!user.password) {
      //   throw new Error("Password not found");
      // }
      const isValidPassword = comparePassword(password, user.password);
      if (!isValidPassword) {
        throw new Error("Invalid password");
      }
      const access_token = signToken({ id: user._id, username: user.username });
      // const user = {
      //   username,
      //   password,
      // };
      // const access_token = await UserModel.login(user);
      return {
        access_token,
        message: "Login successful",
      };
    },
  },
};

module.exports = { userTypeDefs: typeDefs, userResolvers: resolvers };
