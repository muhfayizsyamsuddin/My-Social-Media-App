const UserModel = require("../models/UserModel");

const typeDefs = `#graphql
  type User {
    id: ID!
    name: String
    username: String!
    email: String!
    password: String!
    followers: [Follow]
    following: [Follow]
  }
  type Post{
    id: ID!
    content: String!
    tags: [String]
    imgUrl: String
    author: User
    comments: [Comment]
    likes: [Like]
    createdAt: String
    updatedAt: String
  }
  type Comment {
    username: String!
    content: String!
    createdAt: String
    updatedAt: String
  }
  type Like {
    username: String!
    createdAt: String
    updatedAt: String
  }
  type Follow {
    followerId: ID!
    followingId: ID!
    createdAt: String
    updatedAt: String
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
  input PostInput {
    content: String!
    tags: [String]
    imgUrl: String
  }
  input CommentInput {
    postId: ID!
    content: String!
  }
  input FollowInput {
    followerId: ID!
    followingId: ID!
  }
  type Query {
    getUsers: [User]
    getUserById(id: ID!): User
    getUserByUsername(username: String!): User
    searchUsers(keyword: String!): [User]
  }
  type Mutation {
    register(newUser: RegisterUserInput): User
    login(userLogin: LoginUserInput): String
  }
`;

const resolvers = {
  Query: {
    getUsers: async () => {
      const users = await UserModel.getAllUsers();
      return users;
    },
    getUserById: async (_, { id }) => {
      const user = await UserModel.getAllUsers(id);
      return user;
    },
    getUserByUsername: async (_, { username }) => {
      const user = await UserModel.getUserByUsername(username);
      return user;
    },
    searchUsers: async (_, { keyword }) => {
      // if (!keyword) {
      //   throw new Error("Keyword is required for search");
      // }
      const users = await UserModel.searchUsers(keyword);
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
