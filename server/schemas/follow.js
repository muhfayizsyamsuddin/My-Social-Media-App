const PostModel = require("../models/PostModel");
const UserModel = require("../models/UserModel");
const FollowModel = require("../models/FollowModel");

const typeDefs = `#graphql
  type Follow {
    _id: ID
    followerId: ID
    followingId: ID
    createdAt: String
    updatedAt: String
  }
  input FollowInput {
    followerId: ID
    followingId: ID
  }
  type Mutation {
    followUser(followInput: FollowInput): Follow
  }
`;

const resolvers = {
  Mutation: {
    followUser: async (_, { followInput }) => {
      const { followerId, followingId } = followInput;
      const follow = {
        followerId,
        followingId,
      };
      const result = await FollowModel.createFollow(follow);
      return result;
    },
  },
};

module.exports = { followTypeDefs: typeDefs, followResolvers: resolvers };
